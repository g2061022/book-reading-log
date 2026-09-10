const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const STATE_COOKIE = 'oauth_state';
const SESSION_COOKIE = 'session';

function base64url(bytes) {
  const str = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return str.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function utf8ToB64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function b64UrlToUtf8(b64url) {
  const pad = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat(pad);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return base64url(sig);
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function setCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push('Path=/');
  parts.push('HttpOnly');
  parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  return parts.join('; ');
}

async function createSession(env, user) {
  const payload = utf8ToB64Url(JSON.stringify({
    sub: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture || '',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  }));
  const sig = await hmac(env.SESSION_SECRET, payload);
  return `${payload}.${sig}`;
}

async function verifySession(env, request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = await hmac(env.SESSION_SECRET, payload);
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(b64UrlToUtf8(payload));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

function sessionCookieHeader(token) {
  return setCookie(SESSION_COOKIE, token, { maxAge: SESSION_MAX_AGE });
}

function clearSessionCookieHeader() {
  return setCookie(SESSION_COOKIE, '', { maxAge: 0 });
}

function buildAuthUrl(env, redirectUri, state) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCodeForUser(env, code, redirectUri) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error('token exchange failed');
  const tokenData = await tokenRes.json();

  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) throw new Error('userinfo fetch failed');
  const profile = await userRes.json();

  return {
    sub: profile.sub,
    email: profile.email,
    name: profile.name || profile.email,
    picture: profile.picture || '',
  };
}

function randomState() {
  return base64url(crypto.getRandomValues(new Uint8Array(24)));
}

export {
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
};
