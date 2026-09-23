function decodeXmlEntities(text) {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replaceAll('&amp;', '&');
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXmlEntities(match[1]).trim() : '';
}

function extractAllTags(block, tag) {
  const matches = [...block.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))];
  return matches.map((m) => decodeXmlEntities(m[1]).trim()).filter(Boolean);
}

async function searchPublicBooks(query, type) {
  const param = type === 'author' ? 'creator' : 'title';
  const ndlUrl = `https://ndlsearch.ndl.go.jp/api/opensearch?${param}=${encodeURIComponent(query)}&cnt=20`;

  let xml;
  try {
    const res = await fetch(ndlUrl);
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  if (type === 'author') {
    const names = new Set();
    for (const item of items) {
      for (const creator of extractAllTags(item, 'dc:creator')) {
        if (creator.includes(query)) names.add(creator);
      }
    }
    return [...names].slice(0, 8).map((name) => ({ name }));
  }

  const seen = new Set();
  const results = [];
  for (const item of items) {
    const title = extractTag(item, 'dc:title');
    if (!title || seen.has(title)) continue;
    seen.add(title);
    const author = extractAllTags(item, 'dc:creator').slice(0, 3).join(' / ');
    results.push({ title, author });
    if (results.length >= 8) break;
  }
  return results;
}

export { searchPublicBooks };
