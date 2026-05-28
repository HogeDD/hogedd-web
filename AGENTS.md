<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# エージェント向けプロジェクトガイド

## 基本方針

- このリポジトリはモノレポとして育てる。
- フロントエンドは TypeScript で書く。
- バックエンドは Go で書く。
- アプリケーション全体はクリーンアーキテクチャを意識して設計する。
- 基本はテスト駆動開発で進める。実装前に期待動作をテストで表現できるなら、先にテストを書く。
- GitHub Actions で CI/CD を整備する。
- lint と format は後回しにせず、各言語・各パッケージで丁寧に導入、維持する。
- 小さく作って、短いフィードバックループで改善する。ミニマムにアジャイルで進める。
- `CLAUDE.md` はこのファイルを参照しているため、エージェント向けの共通ルールは `AGENTS.md` に集約する。
- 参考: https://nyosegawa.com/posts/harness-engineering-best-practices-2026/

## 現在の構成

- 現時点では Next.js `16.2.6` の App Router アプリがルート直下にある。
- React は `19.2.4`。
- TypeScript は `strict: true`。
- スタイリングは Tailwind CSS v4。`app/globals.css` で `@import "tailwindcss";` を使っている。
- npm を使っている。依存関係を変更したら `package.json` と `package-lock.json` を必ず同期する。

将来的にモノレポ化する場合は、既存の Next.js アプリを `apps/web` などへ移動することを検討する。ただし、移動は影響範囲が広いため、明示的なタスクとして扱う。

## 目指すモノレポ構成

まだ未作成のディレクトリを前提にコードを書かない。導入時は、以下のような責務分離を基準にする。

```text
apps/
  web/        # TypeScript / Next.js フロントエンド
  api/        # Go バックエンド
packages/
  shared/     # フロントで共有する型やユーティリティが必要な場合のみ
docs/         # ADR、PR decision log、設計判断の記録
```

- 共有パッケージは必要になってから追加する。早すぎる共通化は避ける。
- フロントとバックエンドの境界は API 契約で明確にする。
- API 契約は OpenAPI を単一の生成元にする。
- ディレクトリ構成は拡張性と保守性を優先する。ただし、実体のない抽象化や早すぎる分割は避ける。

## クリーンアーキテクチャ方針

このプロジェクトでは、特に Go バックエンドでクリーンアーキテクチャを前面に置いて開発する。単なるディレクトリ分けではなく、依存方向、型の境界、責務分離を守る。

バックエンド Go では、依存方向を必ず内側へ向ける。

```text
domain          # エンティティ、値オブジェクト、ドメインサービス
usecase         # アプリケーション固有のユースケース、入力/出力 DTO、port interface
interface       # HTTP handler、presenter、controller、OpenAPI 境界
infrastructure  # DB、SQL、外部 API、具体的なフレームワーク実装
```

想定ディレクトリ例:

```text
apps/api/
  cmd/server/                 # 起動、DI、設定読み込み
  internal/
    domain/                   # 外部依存を持たない中心
      <feature>/
    usecase/                  # アプリケーション処理
      <feature>/
    interface/
      http/                   # handler、routing、request/response 変換
      openapi/                # OpenAPI 生成コードの受け皿
    infrastructure/
      postgres/               # SQL、repository 実装、transaction 実装
      external/               # 外部 API client 実装
      migration/              # migration files
```

依存ルール:

- `domain` は外部依存ゼロを基本にする。HTTP、DB、SQL、OpenAPI、環境変数、logger、framework に依存させない。
- `domain` には entity、value object、domain service、domain error を置く。
- `usecase` は `domain` と port interface に依存する。具体的な DB client、SQL driver、HTTP framework、OpenAPI 生成型には依存させない。
- repository interface、external service interface、clock、ID generator などの port は、原則としてそれを必要とする `usecase` 側に置く。
- `interface/http` は request validation、認証済み user/context の取り出し、DTO 変換、status code 変換を担当する。業務ロジックを置かない。
- `infrastructure` は port interface の実装を担当する。SQL、DB row model、外部 API client、framework 固有処理はここに閉じ込める。
- `cmd/server` は composition root として DI を組み立てる。業務ロジックは置かない。
- 小さな機能でも、便利だからという理由で内側の層から外側の層へ依存しない。

型の境界:

- domain entity と OpenAPI 生成型を混ぜない。
- domain entity と DB row model を混ぜない。
- request/response DTO と usecase input/output DTO を必要に応じて分ける。
- OpenAPI 生成型は `interface` 層の境界型として扱い、`domain` や `usecase` へ漏らさない。
- SQL の scan 先 struct は `infrastructure/postgres` に閉じ込め、domain entity へ明示的に変換する。

transaction / DB:

- transaction 境界は usecase 単位で設計する。
- usecase が transaction を必要とする場合は、具体的な `*sql.Tx` ではなく transaction manager interface 経由で扱う。
- repository 実装は context を受け取り、SQL は明示的に書く。
- read/write の責務が複雑になったら、無理に汎用 repository へ寄せず、ユースケースに合った port を設計する。

設計判断:

- 新機能を追加するときは、まず domain と usecase の責務を考える。
- framework、DB、OpenAPI から実装を始めない。外側の都合で内側のモデルを歪めない。
- 迷ったら「このコードは外部技術が変わっても残るか」を基準に層を決める。
- 依存方向が崩れそうな変更は、実装前にディレクトリ構成や interface を見直す。

フロントエンドでも、UI とドメイン寄りの処理を過度に混ぜない。

- React コンポーネントは表示とユーザー操作を中心に保つ。
- API 通信、変換処理、バリデーション、状態管理は責務が分かる場所に置く。
- Server Components を基本とし、必要な場合のみ `"use client"` を付ける。

## API / DB 方針

- フロントエンドとバックエンドの通信は REST を基本にする。
- API はリソース指向で設計し、HTTP method、status code、request/response schema を明確にする。
- API 仕様は OpenAPI の spec-first を基本にする。実装と手書きドキュメントを別々に育てない。
- OpenAPI spec は導入時に `docs/openapi/openapi.yaml` など、生成元が一つだと分かる場所に置く。
- Go 側の server interface / request-response 型生成は `oapi-codegen` を第一候補にする。
- TypeScript 側の API 型生成は `openapi-typescript` を第一候補にする。
- 生成コードは手編集しない。変更が必要な場合は OpenAPI spec を直して再生成する。
- DB は PostgreSQL を前提にする。ホスティングは Neon などの managed PostgreSQL を想定する。
- ORM は原則使わない。SQL を明示的に書く。
- SQL は呼び出し元に散らさず、repository / gateway など infrastructure 層に閉じ込める。
- SQL injection を避けるため、必ずプレースホルダとパラメータバインディングを使う。
- migration tool は無料 OSS の `golang-migrate/migrate` を第一候補にする。
- schema 変更は手作業ではなく migration として管理する。

## テスト方針

- 基本は TDD。失敗するテストで期待動作を固定してから実装する。
- ユーザーが「テストはこちらで書く」と言った場合は、そのテストを先に確認し、テストが示す仕様に合わせて実装する。
- エージェントが不具合を出した場合、同種の失敗を防ぐテストまたは lint ルールを追加する。
- テストは仕様の生きたドキュメントとして扱う。腐りやすい説明文書より、実行できるテストを優先する。
- Go は unit test を基本にし、DB を使う integration test は分離して実行できるようにする。
- フロントエンドは必要に応じて unit / component / E2E を使い分ける。重要なユーザーフローは E2E の導入を検討する。

## Next.js を触る前の注意

- この Next.js は既知のバージョンと異なる可能性がある。ルーティング、metadata、config、cache、Server/Client Components、ファイル規約を触る前に、必ず `node_modules/next/dist/docs/` の該当ガイドを読む。
- 古い Next.js の知識だけで実装しない。
- `next/image`、`next/font`、その他 Next.js の組み込み API を使う場合も、ローカル docs を優先して確認する。

## 開発コマンド

現時点のフロントエンドでは以下を使う。

```bash
npm run dev
npm run lint
npm run build
```

- 通常の検証では `npm run lint` を実行する。
- ルーティング、レンダリング、metadata、Next.js config、ビルド設定を触った場合は `npm run build` も実行する。
- 現時点では test script がない。テストを追加する場合は、スクリプト、設定、CI の実行手順まで揃える。

Go バックエンド導入後は、少なくとも以下のコマンドを整備する。

```bash
go test ./...
go vet ./...
gofmt
```

必要に応じて `golangci-lint` を導入する。

## Lint / Format 方針

- フロントエンドの formatter は Prettier を使う。
- フロントエンドは ESLint と Prettier の責務を明確に分ける。
- ESLint flat config の既存方針を崩さない。
- Go は `gofmt` を必須にする。追加で `go vet`、`golangci-lint` を検討する。
- CI で lint、format check、test、build を落とせる状態にする。
- formatter の結果だけの大きな差分は、機能変更と混ぜない。
- lint / format / test / typecheck は、プロンプト上の注意ではなく機械的なガードレールとして整備する。
- lint や formatter の設定を、テストを通す目的だけで緩めない。変更する場合は理由を明確にする。

## GitHub Actions / CI/CD 方針

GitHub Actions は段階的に整える。

- Pull Request では lint、format check、test、build を実行する。
- CI は PR で必ず実行する。
- フロントエンドとバックエンドは、可能なら path filter や job 分割で効率化する。
- `main` への merge 後に deploy job を走らせる構成を検討する。
- CI で通すコマンドは、ローカルでも同じコマンドで再現できるようにする。
- secrets は GitHub Actions secrets に置き、リポジトリへコミットしない。

## Branch / PR 方針

- 長期ブランチは `main` と `dev` の 2 本を基本にする。
- 通常の開発は `dev` から `feature/*` ブランチを切る。
- PR は原則 `dev` に向ける。
- `main` はリリース可能な状態を保つ。
- PR は小さく保ち、レビューしやすい単位に分ける。
- 大きな設計変更やディレクトリ移動は、機能実装と分けて PR にする。
- PR ごとに、実装内容だけでなく意思決定理由を残す。

## Docs / 意思決定記録

docs は「現在の仕様説明」を長く書く場所ではなく、意思決定の理由と履歴を残す場所として使う。

- PR ごとに、必要に応じて `docs/pr/` へ decision log を残す。
- decision log では「何をしたか」よりも「なぜその選択をしたか」を厚めに書く。
- 採用しなかった選択肢、トレードオフ、将来の見直し条件も書く。
- 大きな技術選定やアーキテクチャ判断は `docs/adr/` に ADR として残す。
- ADR は一度 accepted にしたら安易に書き換えない。変更する場合は新しい ADR で supersede する。
- 実装と乖離しやすい詳細仕様は docs に重複して書かず、テスト、OpenAPI schema、migration、型定義を正とする。

PR decision log の目安:

```text
docs/pr/
  0001-initialize-project-policy.md
  0002-add-api-skeleton.md
```

decision log には最低限、以下を書く。

- 背景
- 決定したこと
- 理由
- 検討した代替案
- トレードオフ
- テスト・検証内容
- 今後の見直し条件

## Secrets / 環境変数

- credentials、API key、DB URL、token、private key は絶対に commit / push しない。
- `.env`、`.env.local`、`.env.*.local` は `.gitignore` で除外する。
- 必要な環境変数は `.env.example` にキー名だけを記載する。実値は入れない。
- Neon など PostgreSQL の接続文字列は secret として扱う。
- GitHub Actions では secrets / environment secrets を使う。
- ログ、テスト出力、スクリーンショットに secret が出ないよう注意する。

## Harness Engineering 方針

参考記事の方針を、リポジトリ運用では次のように扱う。

- AGENTS.md は巨大な設計書にしない。詳細はテスト、ADR、lint 設定、CI、コードに寄せる。
- 品質はエージェントへのお願いではなく、テスト、型チェック、lint、format、CI で強制する。
- ADR は `docs/adr/` に置き、決定理由とステータスを残す。古い ADR は書き換えず、新しい ADR で supersede する。
- PR 単位の判断は `docs/pr/` の decision log に残す。
- 古い説明文書を増やしすぎない。仕様は可能な限りテスト、schema、型、migration、CI で表現する。
- 最初から全部を導入しない。最小のハーネスから始め、ミスが起きたらテストやルールを追加して強化する。

## コーディング規約

- TypeScript と React function components を使う。
- `app/` 配下では Server Components をデフォルトにする。
- `"use client"` は browser API、state、effect、event handler が必要なコンポーネントに限定する。
- `tsconfig.json` の `@/*` alias は、可読性が上がる場合に使う。
- グローバル CSS は `app/globals.css` に限定し、コンポーネント固有の見た目は Tailwind class を優先する。
- 生成物の `.next/`、`next-env.d.ts`、`node_modules/`、`out/`、`build/` は編集しない。

## UI 実装方針

- 現在は create-next-app の初期状態に近い。UI を作る場合はスターター文言を残さず、要求された体験を最初の画面として実装する。
- モバイルからデスクトップまで破綻しないレスポンシブレイアウトにする。
- 装飾よりも、ユーザーが目的を達成しやすい情報設計を優先する。
- テキストの overflow や UI 要素の重なりを避ける。

## 変更前後の確認

- 変更前に既存実装を読む。
- 変更は要求された範囲に絞る。
- ユーザーの未コミット変更を勝手に戻さない。
- 関連する Next.js local docs を確認したか説明できる状態にする。
- `npm run lint` が通ることを確認する。失敗した場合は理由を説明する。
- Next.js の挙動に関わる変更では `npm run build` も確認する。
- Go 導入後は `go test ./...`、`go vet ./...`、format check を確認する。
- 新しい依存関係は理由を明確にし、lockfile を含めて更新する。
