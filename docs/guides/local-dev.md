# ローカル開発手順

このリポジトリは `frontend` の Next.js と `backend/apps/clean-tasks` の Go API を別プロセスで起動する。

## 起動

Terminal 1:

```bash
cd frontend
npm run dev:api
```

Terminal 2:

```bash
cd frontend
npm run dev:web
```

デフォルトでは以下で起動する。

- Web: http://localhost:3000
- API: http://localhost:8080

Codex が検証用に Web を起動する場合は、ユーザーが使う `3000` と競合しないよう `3100` を使う。

同じネットワーク外の端末から確認する場合は、Codex は `3100` で Web を起動し、ngrok で公開する。

```bash
npm --prefix frontend run dev -- --port 3100
ngrok http 3100
```

Next.js は `API_BASE_URL` を使って Go API に接続する。未指定の場合は `http://localhost:8080` を使う。

## 環境変数

`frontend/.env.example` を参考に `frontend/.env.local` を作る。

```bash
API_BASE_URL=http://localhost:8080
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102
```

`.env.local` は commit しない。

スマホなど別端末から dev server にアクセスする場合は、アクセス元 URL の host を `NEXT_ALLOWED_DEV_ORIGINS` に入れる。複数ある場合は comma 区切りにする。

ngrok 経由で確認する場合も、発行された host を `NEXT_ALLOWED_DEV_ORIGINS` に追加して dev server を再起動する。

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102,xxxx.ngrok-free.app
```

## 疎通確認

Go API:

```bash
curl http://localhost:8080/healthz
```

Next.js BFF:

```bash
curl http://localhost:3000/apps/clean-tasks/api/tasks
```

task 作成:

```bash
curl -X POST http://localhost:3000/apps/clean-tasks/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn clean architecture"}'
```

作成後の一覧:

```bash
curl http://localhost:3000/apps/clean-tasks/api/tasks
```

## よくある失敗

- `api server is not reachable`
  - `frontend` で `npm run dev:api` が起動しているか確認する。
- `EADDRINUSE`
  - 既に同じ port のプロセスが動いている。別 port にするか、既存プロセスを止める。
- Web は動くが task が作れない
  - `API_BASE_URL` が Go API の port を指しているか確認する。
