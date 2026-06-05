# Clean TasksをTypeScriptへ移植

## 背景

HogeDDをNext.jsとVercelへ一本化する方針を決めたが、Clean TasksだけはNext.jsのRoute HandlerからGo APIへ接続していた。そのため、ローカル開発ではNext.jsとGoを別々に起動する必要があり、初学者とAIエージェントが同じ環境を再現する手順が複雑になっていた。

## 決定したこと

- Go実装で確認したClean Tasksの仕様をTypeScriptのunit testへ移す。
- domain、usecase、infrastructureの依存方向を分ける。
- Next.jsのRoute HandlerからTypeScriptのusecaseを呼ぶ。
- `npm run typecheck`は`next typegen`後に`tsc`を実行し、生成済みファイルへ依存しないようにする。
- taskの保存先は、現在の挙動を保つため一時的にメモリ実装とする。
- ローカル開発は`npm run dev`だけで起動できる状態にする。
- 旧Go実装の削除は、移植と混ぜずに専用IssueとPRで行う。

## 理由

Go実装を先に削除せず、既存テストとHTTPの挙動を読んでからTypeScriptの失敗するテストを書いた。これにより、言語を変えてもtask作成、一覧、完了、エラーの仕様が変わっていないことを機械的に確認できる。

Clean Architectureは全機能へ一律に適用せず、将来PostgreSQLへ交換する保存処理と、外部技術に依存しないtaskのルールを分離するために使う。Route HandlerはHTTPの変換だけを担当し、業務ルールを持たない。

Next.jsの`RouteContext`は`next dev`、`next build`、`next typegen`で生成される。CIの実行順やローカルに残った生成物へ依存させないため、型検査コマンド自身が型生成を行う。

## 検討した代替案

### Go APIを残す

動作は維持できるが、二つのserver、二つの言語、接続用環境変数が必要になる。現在の規模では運用コストの方が大きいため採用しない。

### Route Handlerへ全処理を書く

ファイル数は減るが、taskのルールと保存方法がNext.jsのHTTP APIへ結合する。DB移行時の変更範囲とunit testの難しさが増えるため採用しない。

### このPRでPostgreSQLも導入する

本番向けには必要だが、言語移植と永続化方式の変更を同時に行うと、不具合の原因を切り分けにくい。今回は既存挙動の移植へ範囲を限定する。

## トレードオフ

- メモリ保存のtaskはserver再起動で消える。
- Vercelでは複数instance間でメモリを共有できないため、本番の永続保存には使えない。
- 旧GoコードとGo CIが、削除PRまで一時的に残る。
- UIにはGo API時代の説明文が残るが、UI変更を避けるため別Issueで扱う。

## テスト・検証内容

- domainでtitleのtrimと空文字拒否をunit testする。
- usecaseで作成、一覧順、完了、存在しないtaskのエラーをunit testする。
- `npm test`
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- 起動したNext.jsに対してGET、POST、PATCH、404をHTTPで確認する。

## 今後の見直し条件

- taskを本番で永続保存するときは、PostgreSQL用repositoryを追加する。
- DB導入時はtransaction、migration、integration testを同じIssueで設計する。
- 旧Go実装の削除PRをmergeしたら、Go CIとGo固有の案内も削除する。
- UIの説明文を更新する場合は、画面変更として独立したIssueで扱う。
