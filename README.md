# book-reading-log

Googleアカウントでログインして使う読書記録サイト。本のタイトルと、内容の重要ポイントを3〜5個、階層的（ツリー構造）にメモできます。記録は全ログインユーザーが互いに閲覧できます。

- **Live**: https://book-reading-log.nyoganyoga.workers.dev
- **Auth**: Google OAuth 2.0(Authorization Code flow)
- **Storage**: Cloudflare D1(`reading-log-db`) — `users` / `books` / `notes`(自己参照でツリー構造)

## 開発

```bash
npm install
npx wrangler dev
```

## 必要なシークレット

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put SESSION_SECRET
```

Google Cloud Console で OAuth クライアントID(ウェブアプリケーション)を作成し、承認済みのリダイレクトURIに
`https://<your-worker>.workers.dev/auth/callback` を登録してください。

## デプロイ

```bash
npx wrangler deploy
```

`wrangler.toml` の D1 データベース(`database_id`)は自分のCloudflareアカウントのものに置き換えてください。
