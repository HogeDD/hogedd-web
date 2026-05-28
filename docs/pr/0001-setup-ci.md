# 0001: CI 初期設定

## 背景

このリポジトリでは、今後 TypeScript のフロントエンドと Go のバックエンドをモノレポで育てる。開発初期から lint、format、typecheck、build を CI で強制し、エージェントや人間の作業結果を機械的に検証できる状態にする必要がある。

## 決定したこと

- GitHub Actions の `CI` workflow を追加する。
- PR と `main` / `dev` への push で CI を実行する。
- 現時点の対象は Next.js フロントエンドのみとする。
- Node.js version は `.node-version` で固定し、GitHub Actions から参照する。
- CI では `npm ci`、`npm run format:check`、`npm run lint`、`npm run typecheck`、`npm run build` を実行する。
- フロントエンド formatter として Prettier を導入する。

## 理由

最初の CI は小さく始める。まだ Go バックエンドが存在しないため、存在しない `apps/api` や Go job を先に作らない。現在の実体である Next.js アプリに対して、壊れた formatting、lint 違反、型エラー、build 失敗を PR 上で検出できることを優先する。

Prettier は formatter として採用済みの方針に合わせた。ESLint は品質ルール、Prettier は整形という責務分離にすることで、format だけの差分と lint ルールの議論を分けやすくする。

`typecheck` を `tsc --noEmit` として明示したのは、Next.js build だけに型検証を寄せると、型チェック単体の失敗を切り分けにくくなるため。

Node.js version は CI workflow に直接書かず `.node-version` に寄せた。ローカル開発と CI の Node version を合わせやすくし、将来 version を上げるときの変更箇所を一つにするため。

## 検討した代替案

- Go job も最初から追加する案
  - Go コードがまだ存在しないため見送った。`apps/api` 作成時に追加する。
- Prettier ではなく Biome を使う案
  - ユーザー方針として Prettier を採用したため見送った。
- push ではなく pull_request のみで CI を動かす案
  - `dev` と `main` の健全性も確認したいため、push でも実行する。

## トレードオフ

CI はまだ monorepo 最適化していない。フロントエンドしかない現時点ではシンプルさを優先し、path filter や job 分割は導入しない。Go バックエンド追加後に、web / api の job 分割と path filter を検討する。

## テスト・検証内容

ローカルで以下を実行して確認する。

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

## 今後の見直し条件

- `apps/web` / `apps/api` へモノレポ化したとき
- Go バックエンドを追加したとき
- テスト runner を導入したとき
- OpenAPI 生成や migration を CI に組み込むとき
