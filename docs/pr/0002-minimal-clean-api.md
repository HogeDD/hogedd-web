# 0002: 最小 Clean Architecture API

## 背景

このリポジトリでは、Go バックエンドをクリーンアーキテクチャ中心で開発する方針を採用している。ただし、方針だけでは学習しにくいため、実際に読める最小実装が必要だった。

また、Go コードを追加するなら、`gofmt`、`go vet`、`go test` を CI に組み込み、フロントエンドと同じように PR 上で機械的に検証できる状態にする必要がある。

## 決定したこと

- `apps/api` に Go module を追加する。
- 題材は `task` とする。
- REST API は最小の 3 endpoint にする。
  - `GET /healthz`
  - `POST /tasks`
  - `GET /tasks`
- 層は `domain`、`usecase`、`interface/http`、`infrastructure`、`cmd/server` に分ける。
- DB はまだ導入しない。
- repository は `infrastructure/memory` の in-memory 実装にする。
- Go CI job を追加し、`gofmt` check、`go vet ./...`、`go test ./...` を実行する。
- 学習用に `docs/guides/clean-architecture-operations.md` を追加する。

## 理由

最初から PostgreSQL、migration、OpenAPI 生成まで入れると、クリーンアーキテクチャの境界よりも周辺ツールの理解が先に必要になる。今回は学習しやすさを優先し、標準ライブラリだけで全層が見える構成にした。

`task` は CRUD の入口として分かりやすく、domain validation、usecase、repository port、HTTP request/response 変換を最小限で表現できる。`healthz` だけだと usecase や repository の境界が見えないため、学習用の題材として弱い。

DB を見送ったのは、まず依存方向とテストの形を固定するため。PostgreSQL は次以降の PR で `infrastructure/postgres` と migration を追加すればよい。

## 検討した代替案

- `healthz` だけを実装する案
  - Clean Architecture の各層が見えないため見送った。
- PostgreSQL repository まで実装する案
  - DB 接続、migration、環境変数、secret 管理が同時に必要になり、最小学習 PR として大きすぎるため見送った。
- Web framework を入れる案
  - 最初は標準ライブラリで十分。framework 導入判断は、routing や middleware の必要性が増えてからにする。
- OpenAPI を同時に導入する案
  - spec-first は方針として採用済みだが、今回は Clean Architecture の最小実装を優先した。API が増える前に別 PR で導入する。

## トレードオフ

in-memory repository は永続化されない。これは本番向けではないが、usecase が repository port に依存し、具体実装を差し替えられることを示す教材としては分かりやすい。

ID generator は sequential な簡易実装にしている。分散環境や永続化では不十分だが、今回の目的は ID 生成を usecase から port として注入する形を見せること。

OpenAPI をまだ入れていないため、API 契約はコードとテストで表現している。次に API を広げる前に OpenAPI spec-first へ移行する。

## テスト・検証内容

Go API:

```bash
cd apps/api
test -z "$(gofmt -l .)"
go vet ./...
go test ./...
```

フロントエンド / repository 全体:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

## 今後の見直し条件

- PostgreSQL / Neon を接続するとき
- `golang-migrate/migrate` を導入するとき
- OpenAPI spec-first を導入するとき
- task API に update/delete などの endpoint を追加するとき
- 認証、認可、transaction 境界が必要になったとき
