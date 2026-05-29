# 0003: フロントエンドと Go API の dev 連携

## 背景

Go API の最小実装が入ったため、次は Next.js 側から実際に API を呼び、dev 環境でアプリケーションとして動かせるか確認する必要があった。

## 決定したこと

- Next.js の画面を create-next-app の初期表示から task UI に置き換える。
- ブラウザから Go API を直接呼ばず、Next.js Route Handler `app/apps/clean-tasks/api/tasks/route.ts` を BFF として挟む。
- Go API の URL は `API_BASE_URL` で指定し、未指定時は `http://localhost:8080` を使う。
- `.env.example` に `API_BASE_URL=http://localhost:8080` を追加する。
- npm scripts に `dev:web` と `dev:api` を追加する。
- `docs/guides/local-dev.md` を追加する。

## 理由

ブラウザから Go API に直接アクセスさせると、dev 環境でも CORS の設定が必要になる。今回はフロントとバックエンドをアプリケーションとしてつなぐ最初の PR なので、CORS 設定を増やすより、Next.js の Route Handler を BFF として挟む方が責務が分かりやすい。

`API_BASE_URL` は Next.js サーバー側でだけ参照するため、ブラウザへ backend URL や将来の secret を漏らしにくい。将来認証や cookie を扱う場合も、BFF 層で調整しやすい。

## 検討した代替案

- Client Component から `http://localhost:8080` を直接叩く案
  - CORS が必要になるため見送った。
- Server Actions で task を作る案
  - 今回は REST API 連携を明示したいため、Route Handler を採用した。
- `concurrently` を入れて `dev:all` を作る案
  - 依存を増やさず、まずは 2 terminal で明示的に起動する形にした。

## トレードオフ

Next.js Route Handler が薄い proxy になるため、経路は一段増える。一方で、CORS を増やさず、フロントから見た API を同一 origin にできる。

`dev:api` と `dev:web` は別 terminal で起動する必要がある。開発体験が重くなったら、後続 PR で dev orchestrator を検討する。

## テスト・検証内容

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
cd backend/apps/clean-tasks && test -z "$(gofmt -l .)"
cd backend/apps/clean-tasks && go vet ./...
cd backend/apps/clean-tasks && go test ./...
```

dev 動作確認:

```bash
npm run dev:api
npm run dev:web
```

`POST /api/tasks` と `GET /api/tasks` が Next.js 経由で Go API に到達することを確認する。

## 今後の見直し条件

- OpenAPI spec-first を導入するとき
- 認証、認可、cookie を扱うとき
- CORS を許可して外部クライアントから Go API を直接叩く必要が出たとき
- dev server の同時起動を自動化したくなったとき
