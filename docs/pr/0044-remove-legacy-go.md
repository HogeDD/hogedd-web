# 旧Go実装とGo CIを削除

## 背景

PR #43でClean Tasksの仕様と実行時処理をTypeScriptへ移植し、Go APIなしでローカル開発と検証が完結するようになった。

旧Go実装とGo用CIを残すと、現在も二つの言語とserverを保守する必要があるように見える。非エンジニアとAIエージェントが迷わず同じ手順を再現できるよう、移植結果の確認後に削除する。

## 決定したこと

- `backend/apps/clean-tasks/`を削除する。
- GitHub ActionsのGo用API jobを削除する。
- 現在参照されるREADME、AGENTS、guideはNode.jsとnpmだけを正規手順とする。
- repository settings guideの必須checkを`Web`へ一本化する。
- 過去のADRとdecision logは当時の判断履歴として書き換えない。

## 理由

言語と起動方法を一本化すると、環境構築、CI、依存更新、障害調査の分岐が減る。`npm run typecheck`、`npm test`、`npm run build`という同じコマンドを人間、AI、CIが使えるため、手順の再現性も高まる。

削除を移植PRと分けることで、仕様変更とファイル削除の差分を混ぜず、問題が起きた場合にPR #43のTypeScript実装と比較できる。

## 検討した代替案

### 旧Go実装を参考コードとして残す

学習資料にはなるが、実行対象と誤認されやすく、依存更新とCI保守が続く。過去の実装はGit履歴から確認できるため採用しない。

### Go CIだけ残す

実行対象がないCIは品質を守らず、時間と判断項目だけを増やすため採用しない。

### 移植PRで同時に削除する

差分が大きくなり、TypeScript移植の挙動比較が難しくなる。移植確認後の独立PRとする。

## トレードオフ

- 現在のbranchからGoの学習コードを直接読めなくなる。
- Go実装を確認する場合はGit履歴またはPR #43以前のcommitを見る必要がある。
- 将来Goを再採用する場合は、現在の要件から新しく設計する必要がある。

## テスト・検証内容

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Clean TasksのGET、POST、PATCH、400、404をHTTPで確認する。
- GitHub ActionsのWeb jobが成功することを確認する。
- `dev`と`main`にbranch protectionが未設定であることを確認し、削除した`API` checkがmergeを妨げないことを確認する。

## 今後の見直し条件

- CPU負荷、並行処理、常時接続、Node.jsのmemory効率が実測で問題になったとき。
- 独立serviceとして分離する運用上の価値が複雑さを上回ったとき。
- 別言語を再採用する場合は新しいADRを作成する。
