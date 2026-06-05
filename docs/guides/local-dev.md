# ローカル開発手順

このリポジトリは、ルートのNext.jsだけを起動すれば開発できる。

Clean TasksのAPIもNext.js内で動く。Go APIを別プロセスで起動する必要はない。

## 最初の起動

repository rootで実行する。

```bash
npm install
npm run dev
```

通常は http://localhost:3000 で確認する。

Codexが検証用に起動する場合は、ユーザーが使う`3000`と競合しないよう`3100`を使う。

```bash
npm run dev -- --hostname 0.0.0.0 --port 3100
```

## 環境変数

必要な場合は`.env.example`を参考に`.env.local`を作る。

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102
```

`.env.local`はcommitしない。secretの実値は`.env.example`、Issue、PR、チャット、スクリーンショットへ載せない。

スマホなど別端末からdev serverへアクセスする場合は、アクセス元URLのhostを`NEXT_ALLOWED_DEV_ORIGINS`へ入れる。複数ある場合はcomma区切りにする。

## ngrokで外部端末から確認する

出先や別ネットワークのスマホから開発中の画面を見る場合は、Next.jsを`3100`で起動し、そのportをngrokで公開する。

### 1. ngrok authtokenを設定する

ngrokのfree planでも、ローカルCLIからtunnelを起動するにはauthtokenが必要になることがある。未設定の場合は`ERR_NGROK_4018`で失敗する。

```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

authtokenはsecretとして扱い、リポジトリやチャットへ載せない。誤って公開した場合はngrok dashboardで直ちにrevokeまたはrotateする。

### 2. Next.jsを3100番で起動する

```bash
npm run dev -- --hostname 0.0.0.0 --port 3100
```

### 3. ngrok tunnelを起動する

別terminalで実行する。

```bash
ngrok http 3100
```

表示された`https://...ngrok-free.app`のURLを外部端末で開く。

### 4. Next.jsのdev origin制限を通す

ngrok URLが拒否された場合は、ngrokのhostを`NEXT_ALLOWED_DEV_ORIGINS`へ追加してdev serverを再起動する。

```bash
NEXT_ALLOWED_DEV_ORIGINS=xxxx.ngrok-free.app npm run dev -- --hostname 0.0.0.0 --port 3100
```

LAN IPも許可する場合:

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102,xxxx.ngrok-free.app npm run dev -- --hostname 0.0.0.0 --port 3100
```

## Clean Tasks APIの疎通確認

一覧:

```bash
curl http://localhost:3000/apps/clean-tasks/api/tasks
```

task作成:

```bash
curl -X POST http://localhost:3000/apps/clean-tasks/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn clean architecture"}'
```

完了:

```bash
curl -X PATCH http://localhost:3000/apps/clean-tasks/api/tasks/<TASK_ID>/complete
```

Codexが`3100`で起動している場合は、URLのportを`3100`へ置き換える。

## よくある失敗

- `EADDRINUSE`
  - 既に同じportのprocessが動いている。別portにするか、既存processを止める。
- ngrokで`ERR_NGROK_4018`が出る
  - authtokenを設定する。
- ngrok URLを開くとNext.jsに拒否される
  - `NEXT_ALLOWED_DEV_ORIGINS`へngrok hostを追加し、dev serverを再起動する。
- 画面は開くがAPI呼び出しだけ失敗する
  - Next.js dev serverのterminalにエラーが出ていないか確認する。
  - URLとHTTP methodが正しいか確認する。
- tokenを貼ってしまった
  - 履歴修正より先にtokenをrevokeまたはrotateする。
