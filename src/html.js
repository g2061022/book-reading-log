const STYLE = `
:root {
  color-scheme: light;
  --primary: #0017c1;
  --primary-dark: #000c73;
  --primary-tint: #e8eafb;
  --bg: #f5f6f8;
  --card: #ffffff;
  --border: #e1e3e8;
  --text: #1a1a1c;
  --text-sub: #5c6270;
  --danger: #c8102e;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif;
  line-height: 1.6;
}
a { color: var(--primary); }
header.appbar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}
header.appbar .brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
header.appbar .brand .bar {
  width: 6px;
  height: 26px;
  background: var(--primary);
  border-radius: 3px;
}
header.appbar h1 { font-size: 1.05rem; margin: 0; }
header.appbar .user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--text-sub);
}
header.appbar .user img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
header.appbar .user a { color: var(--text-sub); text-decoration: none; }
header.appbar .user a:hover { text-decoration: underline; }

main {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px 80px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.toolbar h2 { font-size: 1.1rem; margin: 0; }
button.primary {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
button.primary:hover { background: var(--primary-dark); }
button.ghost {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
  font: inherit;
  cursor: pointer;
  color: var(--text-sub);
}
button.ghost:hover { border-color: var(--primary); color: var(--primary); }
button.ghost.danger:hover { border-color: var(--danger); color: var(--danger); }

.search-wrap { position: relative; margin-bottom: 18px; }
.search-wrap input[type=text] {
  width: 100%;
  font: inherit;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
}
.search-wrap input[type=text]:focus { outline: none; border-color: var(--primary); }
.suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(20, 22, 30, 0.08);
  z-index: 5;
  overflow: hidden;
}
.suggestions .suggestion-label {
  padding: 6px 14px;
  font-size: 0.75rem;
  color: var(--text-sub);
  background: var(--bg);
}
.suggestions .suggestion-item {
  padding: 9px 14px;
  cursor: pointer;
  font-size: 0.92rem;
}
.suggestions .suggestion-item:hover { background: var(--primary-tint); }

#emptyState { text-align: center; color: var(--text-sub); padding: 60px 0; }

.book-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 14px;
  overflow: hidden;
}
.book-card-head {
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.book-card-head .titles { flex: 1; min-width: 0; }
.book-card-head h3 { margin: 0 0 2px; font-size: 1.05rem; }
.book-card-head .author { color: var(--text-sub); font-size: 0.85rem; }
.book-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--text-sub);
}
.book-card-meta img { width: 22px; height: 22px; border-radius: 50%; }
.book-card-actions { display: flex; gap: 6px; align-items: flex-start; }

details.notes-toggle { border-top: 1px solid var(--border); }
details.notes-toggle summary {
  padding: 10px 18px;
  cursor: pointer;
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  list-style: none;
}
details.notes-toggle summary::-webkit-details-marker { display: none; }
details.notes-toggle summary::before { content: "▸ "; }
details.notes-toggle[open] summary::before { content: "▾ "; }
.notes-body { padding: 4px 18px 16px; }

ul.note-tree { list-style: none; margin: 0; padding-left: 0; }
ul.note-tree ul.note-tree {
  padding-left: 18px;
  border-left: 2px solid var(--primary-tint);
  margin-top: 6px;
}
ul.note-tree li { margin: 8px 0; }
ul.note-tree .note-text {
  background: var(--primary-tint);
  display: inline-block;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.92rem;
}
ul.note-tree ul.note-tree .note-text { background: #f0f1f4; }

dialog#bookDialog {
  border: none;
  border-radius: 12px;
  padding: 0;
  width: min(560px, 92vw);
  max-height: 88vh;
  overflow: hidden;
}
dialog#bookDialog::backdrop { background: rgba(20, 22, 30, 0.45); }
.dialog-inner { display: flex; flex-direction: column; max-height: 88vh; }
.dialog-head {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-head h2 { font-size: 1.05rem; margin: 0; }
.dialog-body { padding: 16px 20px; overflow-y: auto; }
.dialog-foot {
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
label { display: block; font-size: 0.85rem; color: var(--text-sub); margin: 14px 0 6px; }
label:first-of-type { margin-top: 0; }
input[type=text] {
  width: 100%;
  font: inherit;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
}
.points-hint { font-size: 0.8rem; color: var(--text-sub); margin-top: -2px; }
.note-node { margin-top: 8px; }
.note-node.depth-1, .note-node.depth-2, .note-node.depth-3, .note-node.depth-4 {
  margin-left: 20px;
  padding-left: 12px;
  border-left: 2px solid var(--primary-tint);
}
.note-row { display: flex; gap: 6px; align-items: flex-start; }
.note-row textarea {
  flex: 1;
  font: inherit;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  resize: vertical;
  min-height: 38px;
}
.note-row .icon-btn {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.78rem;
  cursor: pointer;
  color: var(--text-sub);
  white-space: nowrap;
}
.note-row .icon-btn:hover { border-color: var(--primary); color: var(--primary); }
.note-row .icon-btn.danger:hover { border-color: var(--danger); color: var(--danger); }
#addPointBtn { margin-top: 10px; }
#formError { color: var(--danger); font-size: 0.85rem; min-height: 1.2em; margin-top: 10px; }

.login-wrap {
  max-width: 420px;
  margin: 14vh auto;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 36px 30px;
  text-align: center;
}
.login-wrap .bar { width: 40px; height: 6px; background: var(--primary); border-radius: 3px; margin: 0 auto 18px; }
.login-wrap h1 { font-size: 1.3rem; margin: 0 0 8px; }
.login-wrap p { color: var(--text-sub); font-size: 0.9rem; margin: 0 0 24px; }
.google-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 20px;
  font: inherit;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}
.google-btn:hover { border-color: var(--primary); }
`;

function loginPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>読書記録</title>
<style>${STYLE}</style>
</head>
<body>
  <div class="login-wrap">
    <div class="bar"></div>
    <h1>読書記録</h1>
    <p>読んだ本のタイトルと、内容の重要ポイントを階層的に記録・共有できます。</p>
    <a class="google-btn" href="/auth/login">
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2 1.5-4.6 2.5-7.7 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.8 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.5 36.4 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
      Googleでログイン
    </a>
  </div>
</body>
</html>`;
}

function appPage(user) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>読書記録</title>
<style>${STYLE}</style>
</head>
<body>
  <header class="appbar">
    <div class="brand"><div class="bar"></div><h1>読書記録</h1></div>
    <div class="user">
      ${user.picture ? `<img src="${user.picture}" alt="">` : ''}
      <span>${escapeHtml(user.name)}</span>
      <a href="/auth/logout">ログアウト</a>
    </div>
  </header>
  <main>
    <div class="toolbar">
      <h2>みんなの記録</h2>
      <button class="primary" id="newBookBtn">＋ 記録を追加</button>
    </div>
    <div class="search-wrap">
      <input type="text" id="searchInput" placeholder="タイトル・著者名で検索...">
      <div id="authorSuggestions" class="suggestions" hidden></div>
    </div>
    <div id="list"></div>
    <div id="emptyState" hidden>まだ記録がありません。最初の一冊を登録しましょう。</div>
  </main>

  <dialog id="bookDialog">
    <form class="dialog-inner" id="bookForm">
      <div class="dialog-head">
        <h2 id="dialogTitle">記録を追加</h2>
        <button type="button" class="ghost" id="closeDialogBtn">閉じる</button>
      </div>
      <div class="dialog-body">
        <label for="titleInput">タイトル</label>
        <input type="text" id="titleInput" maxlength="200" required>
        <label for="authorInput">著者(任意)</label>
        <input type="text" id="authorInput" maxlength="120">
        <label>重要なこと(1〜5つ・子項目も追加できます)</label>
        <div class="points-hint">各ポイントに「＋子項目」で詳細メモを階層的に追加できます</div>
        <div id="pointsContainer"></div>
        <button type="button" class="ghost" id="addPointBtn">＋ 重要ポイントを追加</button>
        <div id="formError"></div>
      </div>
      <div class="dialog-foot">
        <button type="button" class="ghost" id="cancelBtn">キャンセル</button>
        <button type="submit" class="primary" id="saveBtn">保存する</button>
      </div>
    </form>
  </dialog>

<script>
window.CURRENT_USER = ${JSON.stringify({ id: user.sub, name: user.name, picture: user.picture })};
</script>
<script>${CLIENT_JS}</script>
</body>
</html>`;
}

function escapeHtml(s) {
  return (s || '').toString()
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const CLIENT_JS = `
const me = window.CURRENT_USER;
const listEl = document.getElementById('list');
const emptyEl = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const suggestionsEl = document.getElementById('authorSuggestions');
const dialog = document.getElementById('bookDialog');
const form = document.getElementById('bookForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const pointsContainer = document.getElementById('pointsContainer');
const formError = document.getElementById('formError');
const dialogTitle = document.getElementById('dialogTitle');

let pointsModel = [];
let editingBookId = null;

function emptyNode() { return { content: '', children: [] }; }

function renderPoints() {
  pointsContainer.innerHTML = '';
  renderNodes(pointsModel, pointsContainer, 0);
  document.getElementById('addPointBtn').disabled = pointsModel.length >= 5;
}

function renderNodes(nodes, parentEl, depth) {
  nodes.forEach((node, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'note-node depth-' + Math.min(depth, 4);

    const row = document.createElement('div');
    row.className = 'note-row';

    const textarea = document.createElement('textarea');
    textarea.value = node.content;
    textarea.placeholder = depth === 0 ? '重要ポイント ' + (idx + 1) : '補足・詳細';
    textarea.rows = 1;
    textarea.addEventListener('input', () => { node.content = textarea.value; });
    row.appendChild(textarea);

    const addChild = document.createElement('button');
    addChild.type = 'button';
    addChild.className = 'icon-btn';
    addChild.textContent = '＋子項目';
    addChild.addEventListener('click', () => { node.children.push(emptyNode()); renderPoints(); });
    row.appendChild(addChild);

    if (depth > 0 || pointsModel.length > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'icon-btn danger';
      removeBtn.textContent = '削除';
      removeBtn.addEventListener('click', () => { nodes.splice(idx, 1); renderPoints(); });
      row.appendChild(removeBtn);
    }

    wrap.appendChild(row);
    if (node.children.length) {
      const childWrap = document.createElement('div');
      renderNodes(node.children, childWrap, depth + 1);
      wrap.appendChild(childWrap);
    }
    parentEl.appendChild(wrap);
  });
}

document.getElementById('addPointBtn').addEventListener('click', () => {
  if (pointsModel.length >= 5) return;
  pointsModel.push(emptyNode());
  renderPoints();
});

function openDialog(book) {
  formError.textContent = '';
  if (book) {
    editingBookId = book.id;
    dialogTitle.textContent = '記録を編集';
    titleInput.value = book.title;
    authorInput.value = book.author || '';
    pointsModel = cloneForEdit(book.notes);
  } else {
    editingBookId = null;
    dialogTitle.textContent = '記録を追加';
    titleInput.value = '';
    authorInput.value = '';
    pointsModel = [emptyNode()];
  }
  renderPoints();
  dialog.showModal();
}

function cloneForEdit(nodes) {
  return nodes.map((n) => ({ content: n.content, children: cloneForEdit(n.children || []) }));
}

document.getElementById('newBookBtn').addEventListener('click', () => openDialog(null));
document.getElementById('closeDialogBtn').addEventListener('click', () => dialog.close());
document.getElementById('cancelBtn').addEventListener('click', () => dialog.close());

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';
  const title = titleInput.value.trim();
  if (!title) return;
  const validPoints = pointsModel.filter((p) => p.content.trim());
  if (validPoints.length < 1 || validPoints.length > 5) {
    formError.textContent = '重要ポイントは1〜5個入力してください(空欄は除きます)';
    return;
  }

  const payload = { title, author: authorInput.value.trim(), notes: pointsModel };
  const url = editingBookId ? '/api/books/' + editingBookId : '/api/books';
  const method = editingBookId ? 'PUT' : 'POST';

  document.getElementById('saveBtn').disabled = true;
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || '保存に失敗しました');
    }
    dialog.close();
    await loadBooks();
  } catch (err) {
    formError.textContent = err.message;
  } finally {
    document.getElementById('saveBtn').disabled = false;
  }
});

function renderReadTree(nodes) {
  const ul = document.createElement('ul');
  ul.className = 'note-tree';
  for (const n of nodes) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'note-text';
    span.textContent = n.content;
    li.appendChild(span);
    if (n.children && n.children.length) {
      li.appendChild(renderReadTree(n.children));
    }
    ul.appendChild(li);
  }
  return ul;
}

function fmtDate(s) {
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('ja-JP');
}

function renderCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';

  const head = document.createElement('div');
  head.className = 'book-card-head';

  const titles = document.createElement('div');
  titles.className = 'titles';
  const h3 = document.createElement('h3');
  h3.textContent = book.title;
  titles.appendChild(h3);
  if (book.author) {
    const author = document.createElement('div');
    author.className = 'author';
    author.textContent = book.author;
    titles.appendChild(author);
  }
  const meta = document.createElement('div');
  meta.className = 'book-card-meta';
  if (book.user.picture) {
    const img = document.createElement('img');
    img.src = book.user.picture;
    meta.appendChild(img);
  }
  const who = document.createElement('span');
  who.textContent = book.user.name + ' ・ ' + fmtDate(book.created_at);
  meta.appendChild(who);
  titles.appendChild(meta);
  head.appendChild(titles);

  if (me && book.user.id === me.id) {
    const actions = document.createElement('div');
    actions.className = 'book-card-actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'ghost';
    editBtn.textContent = '編集';
    editBtn.addEventListener('click', () => openDialog(book));
    const delBtn = document.createElement('button');
    delBtn.className = 'ghost danger';
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => deleteBook(book.id));
    actions.append(editBtn, delBtn);
    head.appendChild(actions);
  }

  card.appendChild(head);

  const details = document.createElement('details');
  details.className = 'notes-toggle';
  const summary = document.createElement('summary');
  summary.textContent = '重要ポイントを見る(' + book.notes.length + ')';
  details.appendChild(summary);
  const body = document.createElement('div');
  body.className = 'notes-body';
  body.appendChild(renderReadTree(book.notes));
  details.appendChild(body);
  card.appendChild(details);

  return card;
}

async function deleteBook(id) {
  if (!confirm('この記録を削除しますか？')) return;
  await fetch('/api/books/' + id, { method: 'DELETE' });
  await loadBooks();
}

let allBooks = [];

async function loadBooks() {
  const res = await fetch('/api/books');
  const data = await res.json();
  allBooks = data.books;
  applyFilter();
}

function applyFilter() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = q
    ? allBooks.filter((b) =>
        b.title.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q))
      )
    : allBooks;

  listEl.innerHTML = '';
  emptyEl.hidden = filtered.length !== 0;
  emptyEl.textContent = allBooks.length === 0
    ? 'まだ記録がありません。最初の一冊を登録しましょう。'
    : '該当する記録が見つかりません。';
  for (const book of filtered) listEl.appendChild(renderCard(book));

  renderAuthorSuggestions(q);
}

function renderAuthorSuggestions(q) {
  if (!q) {
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
    return;
  }
  const authors = [...new Set(allBooks.map((b) => b.author).filter(Boolean))];
  const matches = authors.filter((a) => a.toLowerCase().startsWith(q)).slice(0, 8);
  suggestionsEl.innerHTML = '';
  if (matches.length === 0) {
    suggestionsEl.hidden = true;
    return;
  }
  const label = document.createElement('div');
  label.className = 'suggestion-label';
  label.textContent = '著者名の候補';
  suggestionsEl.appendChild(label);
  for (const author of matches) {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = author;
    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      searchInput.value = author;
      applyFilter();
      suggestionsEl.hidden = true;
    });
    suggestionsEl.appendChild(item);
  }
  suggestionsEl.hidden = false;
}

searchInput.addEventListener('input', applyFilter);
searchInput.addEventListener('focus', applyFilter);
searchInput.addEventListener('blur', () => { suggestionsEl.hidden = true; });

loadBooks();
`;

export { loginPage, appPage };
