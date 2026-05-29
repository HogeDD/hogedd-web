# クリーンアーキテクチャ運用の教科書

この文書は、このリポジトリで Go バックエンドを実装するときの実務手順をまとめる。目的は、クリーンアーキテクチャを抽象論で終わらせず、PR ごとの作業に落とし込むこと。

変数名や用語で迷ったときは `docs/guides/glossary.md` も参照する。

## このリポジトリでの基本形

Go API は `backend/api` に置く。

```text
backend/api/
  cmd/server/
  internal/
    domain/
    usecase/
    interface/
      http/
    infrastructure/
      memory/
      postgres/
      system/
  test/
    usecase/
    interface/
```

各層の役割は次の通り。

| 層               | 役割                       | 置いてよいもの                                       | 置かないもの                       |
| ---------------- | -------------------------- | ---------------------------------------------------- | ---------------------------------- |
| `domain`         | ビジネスルールの中心       | entity、value object、domain error                   | HTTP、SQL、OpenAPI、環境変数       |
| `usecase`        | アプリケーションの振る舞い | service、input/output DTO、port interface            | 具体的な DB client、HTTP framework |
| `interface/http` | REST API 境界              | handler、request/response 変換、status code 変換     | 業務ロジック、SQL                  |
| `infrastructure` | 外部技術の実装             | repository 実装、SQL、ID 生成、時計、外部 API client | domain の都合を壊すモデル          |
| `cmd/server`     | 起動と DI                  | 設定読み込み、依存の組み立て                         | 業務ロジック                       |
| `test`           | 層ごとの外部テスト         | usecase test、HTTP handler test                      | 本番コード                         |

## 依存方向

依存は外側から内側へ向ける。

```text
cmd/server
  -> interface/http
  -> usecase
  -> domain

infrastructure
  -> usecase の port interface を実装
  -> domain entity へ変換
```

`domain` はどこにも依存しない。`usecase` は `domain` と port interface だけを見る。HTTP や DB の都合は外側の層に閉じ込める。

## 新しい機能を追加する手順

基本は TDD で進める。

1. ユースケースを言葉で決める
   - 例: 「ユーザーは title を指定して task を作成できる」
2. `usecase` のテストを書く
   - 成功ケース
   - 入力エラー
   - repository error など必要な失敗ケース
3. `domain` を実装する
   - entity
   - value object
   - validation
   - domain error
4. `usecase` を実装する
   - input/output DTO
   - repository interface
   - clock / ID generator などの port
5. `interface/http` のテストを書く
   - status code
   - request body
   - response body
   - validation error の返し方
6. HTTP handler を実装する
7. `infrastructure` の実装を追加する
   - 最初は `memory` でもよい
   - DB が必要になったら `postgres` に SQL を置く
8. `cmd/server` で DI する
9. CI と同じコマンドをローカルで通す

テストは原則として `backend/api/test/...` に分ける。学習時に「どの層を何で検証しているか」が見えるようにするため。本番コードと同じディレクトリに置く必要があるテストだけ、例外的に対象 package の隣へ置く。

## 今回の最小 Task API の読み方

今回の `task` は学習用の最小例。

```text
domain/task
  Task entity と title validation

usecase/task
  CreateTask / ListTasks
  Repository, IDGenerator, Clock の port

interface/http
  GET /healthz
  POST /tasks
  GET /tasks

infrastructure/memory
  TaskRepository の in-memory 実装

infrastructure/system
  Clock と sequential ID generator

test/usecase/task
  usecase を repository fake と固定 clock / ID generator で検証

test/interface/http
  HTTP request/response を httptest で検証
```

見る順番は `domain -> usecase -> interface/http -> infrastructure -> cmd/server` が分かりやすい。外からではなく、中心から読む。

## REST API を追加するときの考え方

REST はリソースを中心に考える。

- collection: `/tasks`
- item: `/tasks/{taskId}`
- create: `POST /tasks`
- list: `GET /tasks`
- get: `GET /tasks/{taskId}`
- update: `PATCH /tasks/{taskId}`
- delete: `DELETE /tasks/{taskId}`

HTTP handler は REST の翻訳係。業務判断は usecase へ渡す。

handler が担当すること:

- JSON decode
- 入力形式のエラーを `400` にする
- usecase input へ変換する
- usecase error を HTTP status に変換する
- response JSON を返す

handler が担当しないこと:

- DB access
- ID 採番の具体実装
- 業務ルール
- transaction の具体実装

## SQL を導入するときの考え方

ORM は使わず SQL を明示的に書く。ただし、SQL を usecase へ漏らさない。

想定配置:

```text
internal/infrastructure/postgres/
  task_repository.go
  transaction.go
```

守ること:

- SQL は `infrastructure/postgres` に置く
- 必ずプレースホルダを使う
- DB row model と domain entity を混ぜない
- scan した row は明示的に domain entity へ変換する
- migration は `golang-migrate/migrate` で管理する

## OpenAPI を導入するときの考え方

OpenAPI は spec-first にする。生成元は一つ。

想定配置:

```text
docs/openapi/openapi.yaml
backend/api/internal/interface/openapi/
```

生成コードは手編集しない。API の仕様を変える場合は OpenAPI spec を直し、Go / TypeScript の型を再生成する。

重要な境界:

- OpenAPI 生成型は `interface` 層の型
- domain entity と混ぜない
- usecase input/output と必要に応じて変換する

## PR ごとの進め方

PR は小さくする。

良い PR の例:

- `task` の create usecase だけ
- `GET /tasks` の API だけ
- PostgreSQL repository だけ
- OpenAPI spec の導入だけ

避けたい PR:

- ディレクトリ移動、DB 導入、API 実装、フロント実装を一度に入れる
- formatter の大きな差分と機能変更を混ぜる
- decision log なしで大きな技術選定を入れる

PR ごとに `docs/pr/` へ decision log を残す。特に「なぜそうしたか」「何を見送ったか」「いつ見直すか」を書く。

## ローカル検証コマンド

フロントエンド:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Go API:

```bash
cd backend/api
test -z "$(gofmt -l .)"
go vet ./...
go test ./...
```

## よくある判断基準

迷ったときは、次の質問で判断する。

- そのコードは外部技術が変わっても残るか
  - 残るなら `domain` または `usecase`
  - 残らないなら `interface` または `infrastructure`
- その型は API response そのものか
  - そうなら `interface`
- その型は DB scan のためだけか
  - そうなら `infrastructure`
- その処理はビジネス判断か
  - そうなら `domain` または `usecase`
- その処理は HTTP status への変換か
  - そうなら `interface/http`

## 重要な姿勢

クリーンアーキテクチャは、ファイルを細かく分けるためのものではない。変更に強くするための依存制御である。

最初から完璧な抽象化を作らない。小さく作り、テストで守り、PR ごとに decision log を残し、必要になったところだけ強くする。
