# HogeDD 用語集

開発中によく出る言葉を、HogeDDでの意味に絞って説明します。

## 設計

| 用語               | 意味                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| App Router         | Next.jsのファイル構成でURL、画面、layout、APIを作る仕組み。`app/`を使う。                                              |
| モジュラーモノリス | 一つのアプリとして動かしながら、機能ごとのコードを混ぜない構成。HogeDDではアプリごとに`app/apps/<app-name>/`へ閉じる。 |
| Clean Architecture | 重要なルールをNext.js、DB、Vercelなどの外部技術から守る依存ルール。全機能へ多数のfolderを作る意味ではない。            |
| domain             | アプリの中心にあるルールやデータ表現。React、Next.js、DB driverへ依存させない。                                        |
| usecase            | ユーザーが行う一つの操作を実現する処理。例: taskを作成する。                                                           |
| infrastructure     | DB、外部API、時刻、ID生成などの具体実装。                                                                              |
| port               | usecaseが外部機能へ求めるinterface。例: `TaskRepository`。                                                             |
| adapter            | 外部の形式をアプリ内部の形式へ変換する入口や出口。Server ActionやRoute Handlerもadapterとして扱える。                  |
| DTO                | 層や通信境界を越えるためのデータ形状。domain型と常に同じとは限らない。                                                 |
| dependency         | あるコードが別のコードや技術を必要とする関係。HogeDDでは外側からdomain側へ向ける。                                     |
| transaction        | 複数のDB操作をまとめ、全て成功するか全て取り消すかを保証する単位。                                                     |

## Next.js / React

| 用語             | 意味                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Server Component | serverで実行されるReact component。App Routerでは標準。DBやserver-side関数を呼べる。stateやbrowser APIは使えない。 |
| Client Component | browserでも動くReact component。`"use client"`を付け、state、event handler、browser APIが必要な場所だけに使う。    |
| Server Function  | serverで実行され、clientから呼べる非同期関数。`"use server"`で宣言する。                                           |
| Server Action    | formやbuttonなど更新操作から使うServer Function。直接POST可能な入口なので認証・認可が必要。                        |
| Route Handler    | `route.ts`で作るHTTP endpoint。外部APIやWebhookに使い、内部処理を分けるだけの目的では作らない。                    |
| private folder   | `_components`のように`_`で始まるfolder。Next.jsのroute対象外で、実装詳細を置く。                                   |
| route segment    | URLの一部分に対応する`app/`内のfolder。                                                                            |
| colocation       | 画面、component、処理、型を、それを使うrouteの近くへ置くこと。                                                     |
| hydration        | serverで生成した画面にbrowser側のReact操作を接続する処理。Client Componentが増えるほどclient JavaScriptも増える。  |
| Suspense         | 遅いデータを待つ部分だけloading表示にし、他の画面を先に表示するReactの仕組み。                                     |

## データ / API

| 用語       | 意味                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| repository | domainやusecaseから、データの保存・取得方法を隠す境界。                                                     |
| PostgreSQL | HogeDDで採用予定のリレーショナルDB。                                                                        |
| Neon       | serverless環境と相性のよいmanaged PostgreSQL候補。                                                          |
| ORM        | objectとDBを対応付けるlibrary。HogeDDでは原則使わず、SQLを明示的に書く。                                    |
| migration  | DB schemaの変更履歴をファイルで管理し、同じ変更を環境ごとに再現する仕組み。                                 |
| REST       | resourceをURLで表し、HTTP methodで操作するAPI設計。外部APIが必要な場合に使う。                              |
| OpenAPI    | HTTP APIのschemaを機械可読な形式で定義する仕様。複数clientでAPIを使う段階で導入を検討する。                 |
| BFF        | Backend for Frontend。特定frontend向けのbackend境界。Next.js統一後は内部通信のためだけのBFFを原則作らない。 |

## インフラ / 運用

| 用語                 | 意味                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| Vercel               | HogeDDのNext.jsを公開する第一候補。ホスティングと実行環境として使う。            |
| Vercel Hobby         | 初期の非商用公開で使う無料plan。広告・アフィリエイト公開前に最新規約を確認する。 |
| secret               | token、password、DB URL、private keyなど公開してはいけない値。                   |
| environment variable | 実行環境ごとに変わる設定値。secretをコードへ直接書かないためにも使う。           |
| CI                   | PRやpush時にformat、lint、typecheck、test、buildを自動確認する仕組み。           |
| CD                   | CI通過後に環境へ自動deployする仕組み。                                           |
| preview deploy       | PRごとに作る確認用の一時URL。                                                    |
| production deploy    | 利用者がアクセスする本番環境へのdeploy。                                         |

## Git / GitHub

| 用語         | 意味                                                      |
| ------------ | --------------------------------------------------------- |
| Issue        | 作業の背景、範囲、完了条件を記録する単位。                |
| branch       | Issueの変更を`dev`から分けて作業する場所。                |
| PR           | branchの変更をレビューし、`dev`へ取り込む提案。           |
| squash merge | PR内のcommitを一つにまとめてmergeする方法。HogeDDの基本。 |
| ADR          | 大きな設計判断の理由と履歴。`docs/adr/`へ置く。           |
| decision log | PRごとの判断理由。`docs/pr/`へ置く。                      |

## 現在の移行に関する言葉

| 用語               | 意味                                                                               |
| ------------------ | ---------------------------------------------------------------------------------- |
| repository root    | `package.json`、`app/`、`public/`があるリポジトリ直下。npmコマンドを実行する場所。 |
| `backend/`         | TypeScript移植後も削除専用PRまで残している旧Go実装。                               |
| TypeScript完全移行 | Go APIの機能をTypeScriptへ移し、Next.jsだけで開発・deployできる状態にすること。    |
