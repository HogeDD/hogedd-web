<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# HogeDD エージェント向け開発ガイド

このファイルは、人間と AI エージェントが同じ判断基準で開発するための入口です。

分からない用語があっても、最初から全て理解する必要はありません。まず「変更前の判断手順」と「保存場所」を確認してください。

## 最初に守ること

- 作業前に既存実装と関連 docs を読む。
- Issue を起点に `dev` から作業 branch を切る。
- 変更は Issue の範囲に絞る。
- 基本はテスト駆動開発で進める。期待動作をテストで表現できるなら、実装より先にテストを書く。
- secret、token、password、DB URL、private key を commit、Issue、PR、チャット、スクリーンショットへ載せない。
- ユーザーの未コミット変更を勝手に戻さない。
- 新しい抽象化や共有フォルダは、必要性が確認できてから作る。
- 品質は注意書きだけに頼らず、テスト、型、lint、format、CI で守る。

## 現在の構成

Next.jsプロジェクトはリポジトリ直下にある。Clean Tasksを含む実行中の機能はTypeScriptで動く。

```text
app/                        # Next.js 16.2.6 / React 19.2.4
public/                     # 静的ファイル
docs/
test/                       # TypeScriptテスト
package.json
```

- Next.jsとnpmのコマンドはリポジトリ直下で実行する。
- アプリケーションコードはTypeScriptで実装する。
- 開発、検証、buildはNode.jsとnpmだけで完結させる。
- `src/` は現時点では追加しない。

設計理由は `docs/adr/0001-nextjs-modular-monolith.md` を参照する。

## 採用するアーキテクチャ

**Next.js 中心のモジュラーモノリス + 必要な機能だけ Clean Architecture**を採用する。

用語:

- モジュラーモノリス: 一つのアプリとして動かしながら、機能ごとの境界を守る構成。
- Clean Architecture: フォルダを増やす手法ではなく、重要なルールを Next.js、DB、Vercelなどの外部技術から守る依存ルール。
- domain: アプリの中心にあるルールやデータ表現。
- usecase: ユーザーが行う一つの操作を実現する処理。
- infrastructure: DB、外部 API、時刻、ID生成など外部技術の具体実装。

### 常に優先するNext.jsのルール

- Server Components を基本にする。
- `"use client"` は state、event handler、effect、browser API が必要なコンポーネントだけに付ける。
- アプリ固有コードは `app/apps/<app-name>/` の近くへ置く。
- private folder は `_components`、`_lib` のように `_` を付ける。
- 読み取り処理は Server Component から server-side の関数または usecase を直接呼ぶ。
- 画面からの更新処理は Server Actions を基本にする。
- 同じ Next.js アプリ内の Server Component から、自分自身の Route Handler を `fetch` しない。
- Route Handler は外部クライアント、Webhook、公開 REST API が必要な場合に使う。
- Server Action と Route Handler のどちらでも、入力検証、認証、認可を処理の中で確認する。

### Clean Architectureを追加する条件

次の質問に一つでも「はい」があれば、`_domain`、`_usecases`、`_infrastructure` の導入を検討する。

1. DB へ保存するか。
2. 複数画面から使う重要な業務ルールがあるか。
3. 外部 API を使うか。
4. transaction が必要か。
5. 外部技術を将来交換したいか。
6. 単体テストで独立して守るべき判断があるか。

全て「いいえ」なら、まず `_components` と `_lib` だけで作る。迷った場合も単純な構成から始める。

### 単純な機能の例

静的なリンク一覧、ローカルだけで完結するゲーム、表示用の変換処理など。

```text
app/apps/<app-name>/
  page.tsx
  _components/
  _lib/
```

置くもの:

- `page.tsx`: 画面の入口。
- `_components/`: そのアプリだけで使う UI。
- `_lib/`: 純粋関数、型、小さなデータ、表示用変換。

作らないもの:

- 実装が一つしかなく交換予定もない interface。
- 処理を一つ呼ぶだけの usecase。
- 内部処理を呼ぶためだけの Route Handler。

### 複雑な機能の例

DBへ保存するタスク管理、認証が必要な機能、外部APIと連携する機能など。

```text
app/apps/<app-name>/
  page.tsx
  _components/
  _actions/
  _domain/
  _usecases/
  _infrastructure/
  api/                 # 外部HTTP APIが必要な場合だけ
```

役割:

| 場所                       | 役割                                               | 置かないもの                      |
| -------------------------- | -------------------------------------------------- | --------------------------------- |
| `page.tsx` / `_components` | 表示とユーザー操作                                 | SQL、重要な業務ルール             |
| `_actions`                 | FormDataや認証済み情報をusecaseへ渡すServer Action | SQL、再利用したい業務ルール       |
| `_domain`                  | 外部技術が変わっても残るルール                     | React、Next.js、Vercel、DB driver |
| `_usecases`                | ユーザー操作の流れ、port interface                 | JSX、HTTP status、具体的なSQL     |
| `_infrastructure`          | DB、外部APIなどportの実装                          | UI、画面固有の状態                |
| `api/**/route.ts`          | 外部HTTP境界、Webhook                              | 業務ロジック、SQL                 |

依存方向:

```text
page / component / Server Action / Route Handler
                         ↓
                      usecase
                         ↓
                       domain

infrastructure → usecase が必要とする port を実装
```

- `_domain` と `_usecases` から、Next.js、React、Vercel、DB driverをimportしない。
- repository interfaceは、それを必要とするusecase側に置く。
- DB rowとdomain型を同じ型にしない。境界で明示的に変換する。
- transaction境界はusecase単位で考える。

## 保存場所の判断

新しいコードを追加するときは上から順に判断する。

1. 一つのアプリだけで使うか。
   - はい: `app/apps/<app-name>/` 配下。
   - いいえ: 次へ。
2. サイト全体のUIか。
   - はい: `app/_components/`。
3. サイト全体で使う小さな純粋処理か。
   - はい: `app/_lib/`。
4. 複数アプリで実際に再利用済みか。
   - いいえ: 先にアプリ内へ置く。
   - はい: 責務が明確な共有場所を検討する。

共有化のためだけに `utils.ts`、`common/`、`shared/` を増やさない。名前で責務を説明できない共有コードは作らない。

## データ取得と更新

### 読み取り

- Server Component から server-side の関数を呼ぶ。
- 複雑な機能ではusecaseを呼ぶ。
- DB clientをClient Componentへimportしない。
- 遅い処理は必要に応じて`Suspense`や`loading.tsx`で待機表示を用意する。
- cacheを使う前に、Next.js 16のローカルdocsを読む。

### 更新

- 画面内のformやbuttonからの更新はServer Actionを基本にする。
- Server Actionは入力変換と境界処理に留め、重要な処理はusecaseへ渡す。
- 外部からHTTPで呼ばれる必要がある場合だけRoute Handlerを追加する。
- Server Actionは直接POST可能な入口なので、UI側の制御だけを信用しない。

### REST / Route Handler

- HogeDD内部だけで使う機能にRESTを強制しない。
- 外部クライアント、Webhook、公開APIが必要ならRESTを使う。
- Route Handlerではrequest validation、認証・認可、DTO変換、status code変換を行う。
- API契約が複数クライアントに利用される段階でOpenAPI導入を検討する。最初から生成コードを増やさない。

## DB / SQL

- PostgreSQLを前提とする。ホスティングはNeonなどを候補にする。
- ORMは原則使わず、SQLを明示的に書く。
- SQLは`_infrastructure`へ閉じ込める。
- SQL injectionを避けるため、必ずプレースホルダとパラメータバインディングを使う。
- migrationは必ずファイルで管理する。
- TypeScript用migration toolは、PostgreSQL導入issueで選定する。選定前に独自方式を作らない。
- DB接続文字列はsecretとして扱い、`.env.example`にはキー名だけを書く。

## Vercel方針

- 初期はVercel Hobbyで非商用公開する。
- 広告、アフィリエイト、有料機能を公開する前に最新規約を確認し、必要ならProへ移行する。
- Vercelはホスティングと実行環境として使う。
- Vercel固有のバックエンド機能へ依存しない。

原則として採用しないもの:

- Vercel Blob
- Vercel KV
- Edge Config
- Vercel Queues
- Vercel Workflow
- domain / usecaseでVercel固有型を使うこと

必要な外部サービスは、標準APIまたは交換可能なinterfaceを介して使う。

## テスト方針

- 基本はTDD。失敗するテストで期待動作を固定してから実装する。
- テストは`test/`へ置き、本番コードと区別する。
- ユーザーがテストを書く場合は、そのテストを仕様として先に読む。
- 不具合修正では、同じ失敗を防ぐテストを追加する。
- 重要な業務ルールはunit testで守る。
- DB実装やRoute Handlerはintegration testを検討する。
- 重要なユーザーフローはE2E testを検討する。
- unit test runnerはVitestを使う。
- 通常確認とCIでは`npm test`を使う。継続実行は`npm run test:watch`を使う。

想定配置:

```text
test/
  unit/
    apps/<app-name>/
  integration/
    apps/<app-name>/
  e2e/
```

## Next.jsを触る前の注意

このリポジトリのNext.jsは`16.2.6`。古い知識だけで実装しない。

ルーティング、metadata、cache、Server/Client Components、Server Actions、Route Handlers、config、file conventionsを触る前に、Next.jsのローカルdocsを読む。

特に参照する場所:

```text
node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md
node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md
node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md
node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
node_modules/next/dist/docs/01-app/02-guides/data-security.md
```

## 開発コマンド

```bash
npm install
npm run dev -- --port 3100
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

- ユーザーが`3000`を使うため、エージェントのdev serverは`3100`を使う。
- 同じネットワーク外から確認する場合は`ngrok http 3100`を使う。
- 詳細は`docs/guides/local-dev.md`を参照する。
- unit testは`test/unit/**/*.test.ts`へ置く。
- integration testは導入時に`test/integration/`へ置き、実行方法をscriptとCIへ追加する。

## Deploy

- hostingはVercel Hobbyを使う。
- Vercel projectは`hogedd-web`、Root Directoryはrepository root、Node.jsは`.node-version`と同じ`24.x`。
- Production Branchは`main`。`main`以外のbranchはPreviewとして扱う。
- 通常の開発ではCLIからProductionへ直接deployしない。
- `dev`から`main`へのrelease PRを作り、`iwasawarenji954`がmergeするとProduction deploymentが作られる。
- Productionの正規URLは`https://www.hogedd.com/`。`https://hogedd.com/`は`www`へ308 redirectする。
- Vercelの環境変数はProject SettingsでPreview / Productionを分けて管理する。secretをrepositoryへ置かない。
- Hobby利用中は広告、affiliate、有料機能を掲載しない。収益化前に最新規約とPro移行を確認する。
- Vercel固有backend serviceは導入しない。
- deployとrollbackの手順は`docs/guides/deployment.md`を正とする。

## Lint / Format

- TypeScript formatterはPrettierを使う。
- ESLintとPrettierの責務を分ける。
- TypeScriptは`strict: true`を維持する。
- lintやformatterを、テストを通す目的だけで緩めない。
- formatterだけの大きな差分を機能変更へ混ぜない。
- 依存関係を変更したら`package.json`と`package-lock.json`を同期する。

## UI実装

- mobile firstで考える。
- Server Componentsを基本にし、Client Componentの範囲を小さくする。
- ボタンと表示専用要素を見た目と操作で区別する。
- テキストoverflowやUIの重なりを避ける。
- カードや囲みを多用せず、余白、見出し、リスト、セクションのリズムで見せる。
- 既存デザインとコンポーネントを先に確認する。
- 大きなfrontend変更後は`3100`で実際の表示を確認する。

HogeDDのブランドコピーは`docs/guides/brand-copy.md`を参照する。

## Git / Issue / PR

- 長期branchは`main`と`dev`。
- Issueごとに`dev`から作業branchを切る。
- branch名にはIssue番号を含める。
- 新機能は`feature/*`、修正は`fix/*`、docsは`docs/*`、infraは`infra/*`を基本にする。
- PRは原則`dev`へ向ける。
- CIが通ったらsquash mergeする。
- merge後は作業branchを削除する。
- `main`と`dev`はGitHub rulesetで保護されている。直接push、force push、branch削除をしない。
- `main`と`dev`への変更はPRと`Web` CI成功が必須。
- `main`へのmerge / pushは`iwasawarenji954`が行う。
- PRタイトル、本文、コメントは原則日本語。
- PR本文には変更内容だけでなく、なぜその選択をしたかを書く。
- 過去Issueの本文を後から書き換えず、方針変更はコメントで履歴を残す。

詳しい操作は`docs/guides/onboarding.md`を参照する。

## Docs / 意思決定

- 大きな技術判断は`docs/adr/`へADRとして残す。
- acceptedになったADRは書き換えず、変更時は新しいADRでsupersedeする。
- PRごとの判断は`docs/pr/`へdecision logとして残す。
- decision logでは「何をしたか」より「なぜ決めたか」を厚く書く。
- 現在の仕様は、テスト、型、migration、コードを正とする。
- 古い方針のdocsは履歴として残してよいが、現在のガイドから明確に区別する。

decision logの最低項目:

- 背景
- 決定したこと
- 理由
- 検討した代替案
- トレードオフ
- テスト・検証内容
- 今後の見直し条件

## Secrets / 環境変数

- `.env`、`.env.local`、`.env.*.local`をcommitしない。
- 必要な環境変数は`.env.example`へキー名だけ記載する。
- VercelではProject Environment Variablesを使う。
- GitHub ActionsではGitHub SecretsまたはEnvironment Secretsを使う。
- ログ、テスト出力、スクリーンショットにsecretを出さない。
- secretを公開した場合は、履歴修正より先にrevoke / rotateする。

## 変更前後の確認

変更前:

- Issueの範囲を確認したか。
- 関連コードとdocsを読んだか。
- Next.js変更ならローカルdocsを読んだか。
- 単純な構成で始められないか確認したか。
- 新しい共有化やinterfaceが本当に必要か確認したか。

変更後:

- 要求外の変更を混ぜていないか。
- `format:check`、`lint`、`typecheck`が通るか。
- `npm test`が通るか。
- Next.jsの挙動に関わるなら`build`が通るか。
- ユーザー操作に関わるならdesktopとmobileで確認したか。
- secretや生成物を追加していないか。
- 判断理由をPRまたはdocsへ残したか。
