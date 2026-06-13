# Clean Tasksへ共通アプリフォーマットを適用する

## 背景

App、About、Guideの共通フォーマットをゲーム以外でも再利用できるか確認する必要があった。Clean Tasksには共通shellの実装過程で3ページとナビが追加されていたが、旧Go API時代の表示とデモ保存に関する説明不足が残っていた。

## 決定したこと

- Clean TasksでもApp、About、Guideの3ページと`AppPageShell`を使う。
- アプリ固有テーマは追加せず、共通のdefaultテーマを使う。
- App画面の技術説明を現在のNext.js + TypeScript構成へ合わせる。
- Guideで、タスクがサーバーメモリに保存され、再起動や再デプロイで消えることを明示する。
- Aboutの本人文章は変更せず、編集対象の`const`だけをコメントで囲む。

## 理由

共通フォーマットはdefaultテーマでも成立するため、検証のためだけに専用テーマを増やす必要はない。旧構成の説明と保存制約の欠落は利用者を誤解させるため、機能やAPIを変えず表示だけを現在の実装へ合わせる。

## 検討した代替案

### Clean Tasks専用テーマを追加する

アプリごとの差を強く出せるが、Issueの目的はゲーム以外で共通構造を再利用できるかの確認であり、defaultテーマで十分なため採用しない。

### 永続DBを追加する

保存制約を解消できるが、Issueの範囲外であり、現在のrepository境界を使った別Issueで扱う。

## トレードオフ

- defaultテーマのため、Clean Tasks固有の視覚表現は増えない。
- サーバーメモリの保存制約は残るが、Guideから確認できる。

## テスト・検証内容

- App画面から旧Go APIの説明がなくなり、現在のTypeScript構成を表示することをunit testで確認した。
- Guideが共通shellの5セクションと保存制約を表示することをunit testで確認した。
- desktopとmobileでApp、About、Guideのナビ、横あふれ、主要表示を確認した。
- App画面でタスクを作成し、一覧へ反映されることを確認した。
- format、lint、typecheck、unit test、buildを実行した。

## 今後の見直し条件

- Clean Tasksへ永続DBを導入するとき。
- defaultテーマではアプリの識別が難しいと確認されたとき。
