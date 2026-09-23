async function fetchGoogleBooks(env, field, query, maxResults) {
  const params = new URLSearchParams({
    q: `${field}:${query}`,
    maxResults: String(maxResults),
    langRestrict: 'ja',
    key: env.GOOGLE_BOOKS_API_KEY,
  });
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

async function searchPublicBooks(env, query, type) {
  if (type === 'author') {
    const items = await fetchGoogleBooks(env, 'inauthor', query, 20);
    const names = new Set();
    for (const item of items) {
      for (const author of item.volumeInfo?.authors || []) {
        if (author.includes(query)) names.add(author);
      }
    }
    return [...names].slice(0, 8).map((name) => ({ name }));
  }

  // Title search: also search by author name so remembering only the
  // author still surfaces their books, then merge both result sets.
  const [byTitle, byAuthor] = await Promise.all([
    fetchGoogleBooks(env, 'intitle', query, 10),
    fetchGoogleBooks(env, 'inauthor', query, 10),
  ]);

  const seen = new Set();
  const results = [];
  for (const item of [...byTitle, ...byAuthor]) {
    const title = item.volumeInfo?.title;
    if (!title || seen.has(title)) continue;
    seen.add(title);
    const author = (item.volumeInfo?.authors || []).join(' / ');
    results.push({ title, author });
    if (results.length >= 8) break;
  }
  return results;
}

export { searchPublicBooks };
