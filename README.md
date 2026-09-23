# book-reading-log

Googleアカウントでログインして使う読書記録サイト。本のタイトルと、内容の重要ポイントを1〜5個、階層的（ツリー構造）にメモできます。記録は全ログインユーザーが互いに閲覧できます。

- **Live**: https://book-reading-log.nyoganyoga.workers.dev
- **Auth**: Google OAuth 2.0(Authorization Code flow)。他のユーザーに公開されるのはGoogleの本名・写真ではなく、`/settings` で自由に設定できる表示名とアイコン(絵文字)のみ
- **Storage**: Cloudflare D1(`reading-log-db`) — `users` / `books` / `notes`(自己参照でツリー構造)
- **Book search**: 記録追加ダイアログのタイトル・著者欄は Google Books API で実在の書籍を検索・補完

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
npx wrangler secret put GOOGLE_BOOKS_API_KEY
```

Google Cloud Console で OAuth クライアントID(ウェブアプリケーション)を作成し、承認済みのリダイレクトURIに
`https://<your-worker>.workers.dev/auth/callback` を登録してください。

`GOOGLE_BOOKS_API_KEY` は同じ Google Cloud プロジェクトで Books API を有効化し、APIキーを発行してください
(APIの制限を Books API のみに絞ることを推奨します)。

## デプロイ

```bash
npx wrangler deploy
```

`wrangler.toml` の D1 データベース(`database_id`)は自分のCloudflareアカウントのものに置き換えてください。
