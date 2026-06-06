# mainとdevをrulesetで保護

## 背景

VercelのProduction Branchを`main`、Previewを`dev`と作業branchへ分離したが、GitHub側では`main`と`dev`が保護されていなかった。

ルールをdocsへ書くだけでは、直接push、CI未通過merge、force push、branch削除を機械的に防げない。非エンジニアとAIエージェントが同じ手順で安全に開発できるよう、GitHub設定を品質のguardrailにする。

## 決定したこと

- 既存のdisabled rulesetを`protect-main-dev`へ更新して有効化する。
- default branchの`main`と`dev`を対象にする。
- pull requestを必須にする。
- required status checkは現在存在する`Web`だけにする。
- merge方法はsquashだけを許可する。
- force pushとbranch削除を禁止する。
- approvalは0人とする。
- branchを最新状態へ更新することは必須にしない。
- bypass actorを設定せず、管理者もruleを迂回しない。
- PR merge後のhead branch自動削除を有効にする。

## 理由

`Web` checkはformat、lint、typecheck、unit test、production buildを実行する。これを必須にすることで、ローカル環境や担当者の注意力に依存せず、同じ品質条件を通せる。

approvalを必須にすると、現在の少人数体制では自己approvalできずmerge不能になる可能性がある。まずPR差分とCIを必須にし、共同開発者が増えた段階でreview ruleを強化する。

branchを最新状態へ更新するstrict checkは、PRごとに不要なmerge更新を要求し、開発速度を落とす。現在の規模ではCI成功を優先し、競合が増えた場合に見直す。

## 検討した代替案

### Classic branch protectionをbranchごとに設定する

同じruleを`main`と`dev`へ重複して管理する必要がある。既存rulesetがあったため、一つのrulesetで対象branchを管理する。

### approvalを1人必須にする

review品質は上がるが、現在はrepository collaboratorが管理者本人だけである。merge不能を避けるため採用しない。

### 管理者をbypass actorにする

緊急時には便利だが、直接pushやCI未通過mergeを許す抜け道になる。再現性を優先して採用しない。

### branchを常に最新にする

競合や古いbaseに起因する問題を減らせるが、PRのたびに更新が必要になる。現在の規模では必須にしない。

## トレードオフ

- 緊急時でも管理者がruleを迂回できない。
- GitHub Actions障害中は`main`と`dev`へmergeできない。
- approvalが0人なので、人間reviewは機械的には保証されない。
- Write権限のcollaboratorを追加すると、その人も条件を満たしたPRをmergeできる可能性がある。

## テスト・検証内容

- GitHub APIでrulesetのEnforcementが`active`であることを確認。
- GitHub APIで`main`と`dev`が`protected: true`であることを確認。
- 両branchにdeletion、non-fast-forward、pull request、required status checksが適用されていることを確認。
- required status checkが`Web`だけであることを確認。
- allowed merge methodが`squash`だけであることを確認。
- bypass actorが空であることを確認。
- repository設定でmerge commitとrebase mergeが無効、squash mergeが有効であることを確認。
- head branch自動削除が有効であることを確認。

## 今後の見直し条件

- Write権限のcollaboratorを追加するとき。
- review担当者が2人以上になったとき。
- CODEOWNERSを導入するとき。
- PR競合や古いbaseによる障害が増えたとき。
- 緊急releaseの正式な手順を設計するとき。
- GitHub organizationへ移行するとき。
