# 用語集

コードを読むときに迷いやすい用語、型名、変数名をまとめる。

## アーキテクチャ用語

| 用語               | 意味                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Clean Architecture | 依存方向を制御して、業務ルールを外部技術から守る設計方針。                                 |
| domain             | 業務ルールの中心。HTTP、DB、OpenAPI などに依存しない。                                     |
| entity             | domain の中心になるデータと振る舞い。例: `Task`。                                          |
| value object       | 値そのものに意味がある型。例: 将来的な `TaskID`、`Email` など。                            |
| domain error       | domain のルール違反を表す error。例: `ErrEmptyTitle`。                                     |
| usecase            | アプリケーションとして何をするかを表す層。例: task を作る、task を一覧する。               |
| port               | usecase が外部へ要求する interface。例: `Repository`、`IDGenerator`、`Clock`。             |
| adapter            | port を具体技術で実装する外側の部品。例: memory repository、HTTP handler。                 |
| infrastructure     | DB、外部 API、時刻、ID 生成など具体技術を扱う層。                                          |
| interface/http     | HTTP request/response と usecase の変換を担当する層。                                      |
| composition root   | 依存関係を組み立てる場所。今は `cmd/server/main.go`。                                      |
| BFF                | Backend for Frontend。フロントエンド専用の薄い backend 境界。今は `frontend/app/apps/clean-tasks/api/*`。 |

## Go API の主要ファイル

| ファイル                                                     | 役割                                    |
| ------------------------------------------------------------ | --------------------------------------- |
| `backend/api/cmd/server/main.go`                                | API server の起動、依存関係の組み立て。 |
| `backend/api/internal/domain/task/task.go`                      | task の domain entity と validation。   |
| `backend/api/internal/usecase/task/service.go`                  | task の usecase。                       |
| `backend/api/internal/interface/http/router.go`                 | REST API handler。                      |
| `backend/api/internal/infrastructure/memory/task_repository.go` | in-memory repository 実装。             |
| `backend/api/internal/infrastructure/system/clock.go`           | 実時刻を返す clock 実装。               |
| `backend/api/internal/infrastructure/system/id_generator.go`    | 簡易 ID generator 実装。                |
| `backend/api/test/usecase/task/service_test.go`                 | usecase の外部テスト。                  |
| `backend/api/test/interface/http/router_test.go`                | HTTP handler の外部テスト。             |

## Go API の型・変数名

| 名前                    | 場所                    | 意味                                                            |
| ----------------------- | ----------------------- | --------------------------------------------------------------- |
| `Task`                  | `domain/task`           | task entity。アプリの中心にある task の表現。                   |
| `ID`                    | `domain/task`           | task ID 用の domain 型。今は `string` の別名。                  |
| `ErrEmptyTitle`         | `domain/task`           | title が空のときの domain error。                               |
| `New`                   | `domain/task`           | `Task` を作る constructor。title の trim と validation を行う。 |
| `Repository`            | `usecase/task`          | task 保存・取得の port。usecase が必要とする interface。        |
| `IDGenerator`           | `usecase/task`          | ID 採番の port。具体実装は外側に置く。                          |
| `Clock`                 | `usecase/task`          | 現在時刻取得の port。テストで固定時刻に差し替えるために使う。   |
| `Service`               | `usecase/task`          | task usecase の実装。                                           |
| `CreateTaskInput`       | `usecase/task`          | task 作成 usecase の入力 DTO。                                  |
| `TaskOutput`            | `usecase/task`          | usecase から外側へ返す出力 DTO。                                |
| `toOutput`              | `usecase/task`          | domain entity を usecase output へ変換する関数。                |
| `TaskRepository`        | `infrastructure/memory` | `Repository` port の in-memory 実装。                           |
| `SequentialIDGenerator` | `infrastructure/system` | `task-1` のような ID を生成する簡易実装。                       |
| `taskHandler`           | `interface/http`        | `/tasks` の HTTP handler。                                      |
| `createTaskRequest`     | `interface/http`        | HTTP request body 用 DTO。                                      |
| `taskResponse`          | `interface/http`        | HTTP response body 用 DTO。                                     |
| `listTasksResponse`     | `interface/http`        | `GET /tasks` の response body 用 DTO。                          |
| `writeJSON`             | `interface/http`        | JSON response を返す helper。                                   |

## テストで出てくる名前

| 名前                   | 意味                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `fakeRepository`       | usecase test 用の fake。DB なしで保存・一覧取得を再現する。 |
| `fixedIDGenerator`     | usecase test 用の ID generator。常に決まった ID を返す。    |
| `fixedClock`           | usecase / HTTP test 用の clock。常に決まった時刻を返す。    |
| `httptest.NewRecorder` | HTTP response をテスト内で受け取る recorder。               |
| `httptest.NewRequest`  | HTTP request をテスト内で作る helper。                      |
| `assertJSONField`      | JSON response の特定 field を検証する test helper。         |

## Next.js / BFF 側の主要ファイル

| ファイル                 | 役割                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `frontend/app/page.tsx`                                             | トップページ。Server Component としてサイト全体の要素を表示する。 |
| `frontend/app/apps/clean-tasks/_components/tasks-client.tsx`        | task UI。state、event handler、fetch を使う Client Component。   |
| `frontend/app/apps/clean-tasks/api/tasks/route.ts`                  | Next.js Route Handler。アプリ専用 BFF として Go API へ転送する。  |
| `frontend/app/apps/clean-tasks/_lib/tasks.ts`                       | Clean Tasks 専用の task 型と API path。                          |

## Next.js / BFF 側の型・変数名

| 名前                | 場所                     | 意味                                                     |
| ------------------- | ------------------------ | -------------------------------------------------------- |
| `Task`              | `frontend/app/apps/clean-tasks/_lib/tasks.ts` | Clean Tasks の task 型。                          |
| `ListTasksResponse` | `frontend/app/apps/clean-tasks/_lib/tasks.ts` | `GET /apps/clean-tasks/api/tasks` の response 型。 |
| `CreateTaskRequest` | `frontend/app/apps/clean-tasks/_lib/tasks.ts` | task 作成 request 型。                             |
| `TasksClient`       | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | task UI の Client Component。 |
| `LoadState`         | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | task 読み込み状態。`idle`、`loading`、`ready`、`error`。 |
| `tasks`             | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | 画面に表示する task 配列。 |
| `title`             | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | 入力中の task title。 |
| `message`           | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | 接続状態やエラーを画面に出す文字列。 |
| `fetchTasks`        | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | アプリ専用 BFF から task 一覧を取得する関数。 |
| `loadTasks`         | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | loading state を含めて task 一覧を読み直す関数。 |
| `handleSubmit`      | `frontend/app/apps/clean-tasks/_components/tasks-client.tsx` | task 作成 form の submit handler。 |
| `tasksAPIPath`      | `frontend/app/apps/clean-tasks/_lib/tasks.ts` | アプリ専用 BFF の path。 |
| `API_BASE_URL`      | `.env.example`           | Next.js BFF が接続する Go API URL。                      |

## DTO とは

DTO は Data Transfer Object の略。層の境界でデータを渡すための型。

このリポジトリでは、似た形でも責務ごとに型を分ける。

| 種類                      | 例                                  | 理由                                     |
| ------------------------- | ----------------------------------- | ---------------------------------------- |
| domain entity             | `domain/task.Task`                  | 業務ルールの中心。                       |
| usecase input/output      | `CreateTaskInput`、`TaskOutput`     | usecase の入力・出力を明確にする。       |
| HTTP request/response DTO | `createTaskRequest`、`taskResponse` | JSON と status code の境界を明確にする。 |
| frontend type             | `frontend/app/apps/clean-tasks/_lib/tasks.ts` の `Task` | UI が扱うデータ形状を明確にする。        |

## 読むときのコツ

- `domain` から読む。外側の HTTP や UI から読むと迷いやすい。
- `interface` は翻訳係として読む。業務判断を探さない。
- `infrastructure` は具体技術として読む。今は memory、将来は postgres。
- `frontend/app/apps/clean-tasks/api/*` は Clean Tasks の BFF として読む。Clean Architecture の中心ではなく、Go API の外側にある薄い adapter。
- 似た型名が出てきたら「どの層の型か」を見る。
