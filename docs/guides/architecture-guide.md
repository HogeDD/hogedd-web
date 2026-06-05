# Next.js アーキテクチャ実践ガイド

この文書は、HogeDDで新しい機能を作るときに、どこへ何を書くかを判断するためのガイドです。

詳しい決定理由は`docs/adr/0001-nextjs-modular-monolith.md`、エージェントが必ず守るルールは`AGENTS.md`を参照してください。

## 最初の結論

HogeDDでは、全ての機能へ同じ複雑な構成を強制しません。

```text
単純な機能
  → Next.jsのpage、component、libで作る

複雑な機能
  → domain、usecase、infrastructureの境界を追加する
```

迷った場合は、単純な構成から始めます。後から必要になったときに分けます。

## 新機能を作る前の質問

次の質問に答えます。

1. この機能は一つの画面だけで完結するか。
2. DBへデータを保存するか。
3. 複数画面から使う重要なルールがあるか。
4. 外部APIを使うか。
5. 複数のDB更新を一つの処理として成功・失敗させる必要があるか。
6. 外部のアプリやサービスからHTTPで呼ぶ必要があるか。
7. browser API、state、event handlerが必要か。
8. DBや外部サービスを将来交換したいか。

質問2、3、4、5、8のどれかが「はい」なら、Clean Architectureの境界を追加する候補です。

## 単純な機能

例:

- 静的なYouTubeリンク一覧
- ブラウザ内だけで完結するゲーム
- 表示用のテキスト変換

```text
app/apps/sample/
  page.tsx
  _components/
  _lib/
```

### `page.tsx`

URLへアクセスしたときの画面の入口です。

ここで行うこと:

- Server Componentとして画面を組み立てる
- server-sideで必要なデータを読む
- UI componentへ必要な値を渡す

ここへ置かないもの:

- 長い業務ルール
- SQL
- 再利用したい複雑な処理

### `_components/`

そのアプリだけで使うUIを置きます。

state、event handler、browser APIが必要なファイルだけ`"use client"`を付けます。親の`page.tsx`までClient Componentにしないようにします。

### `_lib/`

小さな型、純粋関数、固定データを置きます。

純粋関数とは、同じ入力なら同じ結果を返し、DB、画面、時刻などの外部状態を直接変更しない関数です。

## 複雑な機能

例:

- DBへ保存するタスク管理
- 認証と権限判定がある管理画面
- 外部APIからデータを取得して保存する機能

```text
app/apps/tasks/
  page.tsx
  _components/
  _actions/
  _domain/
  _usecases/
  _infrastructure/
```

必要になるまで全てのfolderを作る必要はありません。

### `_domain/`

外部技術が変わっても残るルールを置きます。

例:

- 空のtask titleを許可しない
- 公開済みの記事だけ表示対象にする
- 同じユーザーが同時に一つの予約しか持てない

React、Next.js、Vercel、DB driverはimportしません。

### `_usecases/`

ユーザーが行う一つの操作を実現します。

例:

- taskを作成する
- 公開中のアプリを一覧取得する
- 記事を公開する

DBや外部APIが必要なら、usecaseが必要とするinterfaceをここへ置きます。

```ts
export interface TaskRepository {
  save(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
}
```

usecaseは具体的なPostgreSQL clientを知りません。

### `_infrastructure/`

usecaseが必要とするinterfaceの具体実装を置きます。

例:

- PostgreSQLへSQLを実行するrepository
- YouTube API client
- 現在時刻を返すclock
- UUIDを生成するID generator

SQLや外部サービス固有の型は、このfolderの外へ漏らしません。

### `_actions/`

画面から更新処理を呼ぶServer Actionを置きます。

Server Actionが担当すること:

- FormDataや入力値を受け取る
- 入力形式を検証する
- 認証・認可を確認する
- usecaseを呼ぶ
- 必要なcache更新やredirectを行う

Server Actionが担当しないこと:

- SQLを直接書く
- 長い業務ルールを持つ
- UI側で検証済みだから安全だと決めつける

## データを読む

Server Componentからserver-sideの関数またはusecaseを直接呼びます。

```tsx
export default async function TasksPage() {
  const tasks = await listTasks();

  return <TasksList tasks={tasks} />;
}
```

同じNext.jsアプリ内の`/api/tasks`を`fetch`する必要はありません。内部HTTP通信を増やさず、関数を直接呼びます。

## データを更新する

画面内のformやbuttonからの更新はServer Actionを基本にします。

```ts
"use server";

export async function createTaskAction(formData: FormData) {
  const title = formData.get("title");
  await createTask({ title });
}
```

実際には入力検証、認証・認可、エラー処理が必要です。上の例は呼び出し方向だけを示しています。

## Route Handlerを使うとき

次の場合に使います。

- 外部サービスからWebhookを受ける
- モバイルアプリなど外部クライアントへAPIを公開する
- JavaScript以外のクライアントからREST APIを利用する
- browserからHTTP endpointを呼ぶ必要が明確にある

Next.js内部の処理を分ける目的だけでは作りません。

Route Handlerは翻訳係です。

- HTTP requestを検証する
- 認証・認可を確認する
- usecase inputへ変換する
- usecase errorをHTTP statusへ変換する
- responseを返す

業務ルールとSQLは置きません。

## Client Componentを使うとき

次のどれかが必要な場合だけ使います。

- `useState`
- `useEffect`
- click、inputなどのevent handler
- `window`、`localStorage`などのbrowser API
- client専用library

ページ全体へ`"use client"`を付けず、操作が必要な小さいcomponentへ限定します。

## テストの選び方

```text
test/
  unit/
  integration/
  e2e/
```

- unit test runnerはVitestを使います。
- 通常確認とCIは`npm test`、開発中の継続実行は`npm run test:watch`を使います。
- unit test: domain、usecase、純粋関数。
- integration test: repository、DB、Route Handler。
- E2E test: ユーザーが画面上で行う重要な一連の操作。

不具合修正では、同じ問題が戻らないテストを追加します。

## 迷ったときの安全な選択

- folderを増やすか迷う: 増やさない。
- 共有化するか迷う: アプリ内に置く。
- interfaceを作るか迷う: 具体実装を一つ作る。
- Route Handlerを作るか迷う: Server ComponentまたはServer Actionから関数を直接呼ぶ。
- Client Componentにするか迷う: Server Componentから始める。
- Vercel固有サービスを使うか迷う: 使わず、標準APIで代替できるか確認する。
- 大きな変更になりそう: 子Issueへ分ける。

## 旧Go実装を扱うときの注意

Next.jsプロジェクトはリポジトリ直下へ移動済みです。Clean Tasksの仕様もTypeScriptへ移植済みです。

- 新しいGo機能は追加しません。
- 通常の開発と動作確認ではGo APIを起動しません。
- `backend/`は削除作業を独立したIssueとPRで行うまで一時的に残します。
