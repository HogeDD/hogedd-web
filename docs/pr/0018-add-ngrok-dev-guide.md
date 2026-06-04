# ngrok を使った外部確認手順を追加

## 背景

出先や別ネットワークから開発中の画面を確認するときに ngrok を使いたい。

一方で、ngrok authtoken は secret であり、GitHub issue、PR、docs、チャットに貼る運用は避ける必要がある。特に Codex や他の AI エージェントと作業する場合、token を本文に貼るとログや履歴に残りやすい。

## 決定したこと

- `docs/guides/local-dev.md` に ngrok の外部確認手順を追記する。
- authtoken はローカルの ngrok config にだけ保存する方針にする。
- Next.js dev server は検証用に `3100` で起動する。
- ngrok URL で確認するときの `NEXT_ALLOWED_DEV_ORIGINS` 設定を明記する。
- README から local dev guide へ導線を追加する。

## 理由

この issue の目的は、ngrok の tunnel そのものをリポジトリに組み込むことではなく、外部端末から確認するときに迷わない手順を整えること。

authtoken を `.env.local` や GitHub Secrets に置く選択もあるが、今回の用途では CLI の `ngrok config add-authtoken` が一番単純で、リポジトリの管理対象にもならない。

`3100` を標準にするのは、ユーザーが `3000` で開発サーバーを起動していることが多く、Codex の検証と競合させないため。

## 検討した代替案

- `.env.local` に ngrok authtoken を置く
  - ngrok CLI の標準手順から外れるため採用しない。
  - `.env.local` に secret を増やすと、誤共有のリスクも増える。
- GitHub Actions secrets に ngrok authtoken を置く
  - 今回は deploy や CI tunnel を作る話ではないため採用しない。
- 有料 ngrok の固定ドメインを前提にする
  - free plan で進めたい方針に合わないため採用しない。

## トレードオフ

- free plan の ngrok URL は起動ごとに変わるため、`NEXT_ALLOWED_DEV_ORIGINS` の更新が必要になる。
- token 設定は各開発者のローカル端末ごとに必要になる。
- 外部公開中はローカル dev server がインターネットから到達可能になるため、公開する画面とログに注意する必要がある。

## テスト・検証内容

- Markdown として手順を追加した。
- secret の実値は記載していない。

## 今後の見直し条件

- 外部確認の頻度が増え、毎回 ngrok host を設定するのが負担になった場合。
- チームで固定 preview 環境が必要になった場合。
- 認証が必要な画面や個人情報を扱う画面を外部公開する必要が出た場合。
