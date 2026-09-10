import {
  STATE_COOKIE,
  getCookie,
  setCookie,
  createSession,
  verifySession,
  sessionCookieHeader,
  clearSessionCookieHeader,
  buildAuthUrl,
  exchangeCodeForUser,
  randomState,
} from './auth.js';
import { upsertUser, createBook, updateBook, deleteBook, getBookOwner, listBooks } from './db.js';
import { loginPage, appPage } from './html.js';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth/login') {
      const state = randomState();
      const redirectUri = `${url.origin}/auth/callback`;
      const authUrl = buildAuthUrl(env, redirectUri, state);
      return new Response(null, {
        status: 302,
        headers: {
          Location: authUrl,
          'Set-Cookie': setCookie(STATE_COOKIE, state, { maxAge: 600 }),
        },
      });
    }

    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const savedState = getCookie(request, STATE_COOKIE);
      if (!code || !state || !savedState || state !== savedState) {
        return new Response('認証に失敗しました(state不一致)', { status: 400 });
      }
      try {
        const redirectUri = `${url.origin}/auth/callback`;
        const user = await exchangeCodeForUser(env, code, redirectUri);
        await upsertUser(env, user);
        const token = await createSession(env, user);
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
            'Set-Cookie': sessionCookieHeader(token),
          },
        });
      } catch (err) {
        return new Response('認証に失敗しました', { status: 500 });
      }
    }

    if (url.pathname === '/auth/logout') {
      return new Response(null, {
        status: 302,
        headers: { Location: '/', 'Set-Cookie': clearSessionCookieHeader() },
      });
    }

    const session = await verifySession(env, request);

    if (url.pathname === '/' && request.method === 'GET') {
      if (!session) {
        return new Response(loginPage(), { headers: { 'content-type': 'text/html; charset=utf-8' } });
      }
      return new Response(appPage(session), { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }

    if (url.pathname.startsWith('/api/')) {
      if (!session) return json({ error: 'ログインが必要です' }, 401);

      if (url.pathname === '/api/books' && request.method === 'GET') {
        const books = await listBooks(env);
        return json({ books });
      }

      if (url.pathname === '/api/books' && request.method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body || !body.title) return json({ error: 'タイトルを入力してください' }, 400);
        try {
          const id = await createBook(env, session.sub, body.title.toString().trim().slice(0, 200), (body.author || '').toString().trim().slice(0, 120), body.notes);
          return json({ id }, 201);
        } catch (err) {
          return json({ error: err.message }, 400);
        }
      }

      const bookMatch = url.pathname.match(/^\/api\/books\/(\d+)$/);
      if (bookMatch && (request.method === 'PUT' || request.method === 'DELETE')) {
        const bookId = Number(bookMatch[1]);
        const owner = await getBookOwner(env, bookId);
        if (!owner) return json({ error: '記録が見つかりません' }, 404);
        if (owner !== session.sub) return json({ error: '権限がありません' }, 403);

        if (request.method === 'DELETE') {
          await deleteBook(env, bookId);
          return json({ ok: true });
        }

        const body = await request.json().catch(() => null);
        if (!body || !body.title) return json({ error: 'タイトルを入力してください' }, 400);
        try {
          await updateBook(env, bookId, body.title.toString().trim().slice(0, 200), (body.author || '').toString().trim().slice(0, 120), body.notes);
          return json({ ok: true });
        } catch (err) {
          return json({ error: err.message }, 400);
        }
      }

      return json({ error: 'Not Found' }, 404);
    }

    return new Response('Not Found', { status: 404 });
  },
};
