async function upsertUser(env, user) {
  await env.DB.prepare(
    `INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, picture = excluded.picture`
  ).bind(user.sub, user.email, user.name, user.picture).run();
}

function cleanNodes(nodes, depth = 0) {
  if (!Array.isArray(nodes) || depth > 10) return [];
  const out = [];
  for (const n of nodes) {
    const content = (n && n.content ? n.content.toString() : '').trim().slice(0, 500);
    if (!content) continue;
    out.push({ content, children: cleanNodes(n.children, depth + 1) });
  }
  return out;
}

async function insertNoteTree(env, bookId, nodes, parentId) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const res = await env.DB.prepare(
      'INSERT INTO notes (book_id, parent_id, content, sort_order) VALUES (?, ?, ?, ?)'
    ).bind(bookId, parentId, node.content, i).run();
    const newId = res.meta.last_row_id;
    if (node.children.length) {
      await insertNoteTree(env, bookId, node.children, newId);
    }
  }
}

function buildTree(flatNotes) {
  const byId = new Map();
  for (const n of flatNotes) byId.set(n.id, { id: n.id, content: n.content, children: [] });
  const roots = [];
  for (const n of flatNotes) {
    const node = byId.get(n.id);
    if (n.parent_id && byId.has(n.parent_id)) {
      byId.get(n.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

async function createBook(env, userId, title, author, notes) {
  const cleaned = cleanNodes(notes);
  if (cleaned.length < 3 || cleaned.length > 5) {
    throw new Error('重要ポイントは3〜5個で入力してください');
  }
  const res = await env.DB.prepare(
    'INSERT INTO books (user_id, title, author) VALUES (?, ?, ?)'
  ).bind(userId, title, author || null).run();
  const bookId = res.meta.last_row_id;
  await insertNoteTree(env, bookId, cleaned, null);
  return bookId;
}

async function updateBook(env, bookId, title, author, notes) {
  const cleaned = cleanNodes(notes);
  if (cleaned.length < 3 || cleaned.length > 5) {
    throw new Error('重要ポイントは3〜5個で入力してください');
  }
  await env.DB.prepare('UPDATE books SET title = ?, author = ? WHERE id = ?')
    .bind(title, author || null, bookId).run();
  await env.DB.prepare('DELETE FROM notes WHERE book_id = ?').bind(bookId).run();
  await insertNoteTree(env, bookId, cleaned, null);
}

async function deleteBook(env, bookId) {
  await env.DB.prepare('DELETE FROM notes WHERE book_id = ?').bind(bookId).run();
  await env.DB.prepare('DELETE FROM books WHERE id = ?').bind(bookId).run();
}

async function getBookOwner(env, bookId) {
  const row = await env.DB.prepare('SELECT user_id FROM books WHERE id = ?').bind(bookId).first();
  return row ? row.user_id : null;
}

async function listBooks(env) {
  const { results: books } = await env.DB.prepare(
    `SELECT books.id, books.title, books.author, books.created_at,
            users.id as user_id, users.name as user_name, users.picture as user_picture
     FROM books JOIN users ON users.id = books.user_id
     ORDER BY books.id DESC LIMIT 200`
  ).all();

  if (books.length === 0) return [];

  const ids = books.map((b) => b.id);
  const placeholders = ids.map(() => '?').join(',');
  const { results: notes } = await env.DB.prepare(
    `SELECT id, book_id, parent_id, content, sort_order FROM notes
     WHERE book_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`
  ).bind(...ids).all();

  const notesByBook = new Map();
  for (const n of notes) {
    if (!notesByBook.has(n.book_id)) notesByBook.set(n.book_id, []);
    notesByBook.get(n.book_id).push(n);
  }

  return books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    created_at: b.created_at,
    user: { id: b.user_id, name: b.user_name, picture: b.user_picture },
    notes: buildTree(notesByBook.get(b.id) || []),
  }));
}

export { upsertUser, createBook, updateBook, deleteBook, getBookOwner, listBooks };
