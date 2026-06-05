# ローカル開発手順

このリポジトリは、ルートのNext.jsと`backend/apps/clean-tasks`のGo APIを別プロセスで起動する。

> Go APIは既存のClean TasksをTypeScriptへ移植するまでだけ利用します。新しい機能はNext.js / TypeScriptで作ります。

## 起動

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev
```

デフォルトでは以下で起動する。

- Web: http://localhost:3000
- API: http://localhost:8080

Codex が検証用に Web を起動する場合は、ユーザーが使う `3000` と競合しないよう `3100` を使う。

同じネットワーク外の端末から確認する場合は、Codex は `3100` で Web を起動し、ngrok で公開する。

```bash
npm run dev -- --port 3100
ngrok http 3100
```

Next.js は `API_BASE_URL` を使って Go API に接続する。未指定の場合は `http://localhost:8080` を使う。

## ngrok で外部端末から確認する

出先や別ネットワークのスマホから開発中の画面を見る場合は、Next.js dev server を `3100` で起動し、その port を ngrok で公開する。

### 1. ngrok authtoken を設定する

ngrok の free plan でも、ローカル CLI から tunnel を起動するには authtoken が必要になることがある。未設定の場合は `ERR_NGROK_4018` で失敗する。

authtoken は ngrok dashboard で確認し、ローカル端末にだけ保存する。

```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

`<YOUR_NGROK_AUTHTOKEN>` は実際の token に置き換える。

重要:

- ngrok authtoken は secret として扱う。
- token を GitHub issue、PR、README、docs、チャット、スクリーンショットに貼らない。
- token を `.env` や `.env.local` に入れる必要はない。
- token を誤って公開した場合は、ngrok dashboard で revoke / rotate する。

設定済みか確認したい場合は、ngrok の config ファイルを直接読むのではなく、まず tunnel が起動できるかで確認する。

### 2. Next.js を 3100 番で起動する

Codex が検証する場合は、ユーザーが `3000` を使っている前提で `3100` を使う。

```bash
npm run dev -- --hostname 0.0.0.0 --port 3100
```

`--hostname 0.0.0.0` を付けると、同じネットワーク内の端末や ngrok からアクセスしやすい。

### 3. ngrok tunnel を起動する

別 terminal で実行する。

```bash
ngrok http 3100
```

起動後に表示される `https://...ngrok-free.app` の URL を外部端末で開く。

### 4. Next.js dev origin 制限を通す

ngrok URL でアクセスすると、Next.js の dev origin 制限により拒否されることがある。その場合は、ngrok の host を `NEXT_ALLOWED_DEV_ORIGINS` に追加する。

例:

```bash
NEXT_ALLOWED_DEV_ORIGINS=xxxx.ngrok-free.app npm run dev -- --hostname 0.0.0.0 --port 3100
```

既に LAN IP も許可している場合は comma 区切りにする。

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102,xxxx.ngrok-free.app npm run dev -- --hostname 0.0.0.0 --port 3100
```

`NEXT_ALLOWED_DEV_ORIGINS` を変更したら、dev server を再起動する。

### 5. API も必要な場合

画面が BFF 経由で Go API を呼ぶ場合は、Go API もローカルで起動しておく。

```bash
npm run dev:api
```

Next.js から見た API の接続先は `API_BASE_URL` で決まる。ローカル端末上で Next.js と Go API を両方動かす場合は、通常 `http://localhost:8080` のままでよい。

## ngrok のトラブルシュート

- `ERR_NGROK_4018`
  - authtoken が未設定。`ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>` を実行する。
- ngrok URL を開くと Next.js に拒否される
  - `NEXT_ALLOWED_DEV_ORIGINS` に ngrok host を追加して dev server を再起動する。
- ngrok URL は開くが画面が更新されない
  - Next.js dev server が `3100` で起動しているか確認する。
  - `ngrok http 3100` になっているか確認する。
- 画面は開くが API 呼び出しだけ失敗する
  - Go API が起動しているか確認する。
  - `API_BASE_URL` が Next.js から到達できる値になっているか確認する。
- token を貼ってしまった
  - すぐに ngrok dashboard で token を revoke / rotate する。
  - GitHub の issue / PR / commit に残った場合は、履歴から完全に消すより先に token を無効化する。

## 環境変数

`.env.example`を参考に`.env.local`を作る。

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
  - repository rootで`npm run dev:api`が起動しているか確認する。
- `EADDRINUSE`
  - 既に同じ port のプロセスが動いている。別 port にするか、既存プロセスを止める。
- Web は動くが task が作れない
  - `API_BASE_URL` が Go API の port を指しているか確認する。
