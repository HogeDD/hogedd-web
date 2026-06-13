# GitHub Organizationのセキュリティ設定を整える

## 背景

GitHub repositoryをOrganization`HogeDD`へ移管した後も、repository rulesetとGitHub Actionsの権限は維持されていた。一方、Organizationの2FA必須化、secret scanning、push protection、Dependabot、memberのrepository作成権限は初期状態のままだった。

## 決定したこと

- Organizationへのアクセスに2FAを必須とする。
- 2FA未設定者がいないことを確認してから必須化する。
- Organization ownerを復旧手段として2名以上維持する。
- default repository permissionは`Read`を維持する。
- 一般memberによるrepositoryの新規作成を禁止する。
- 一般memberによるteam作成を禁止する。
- repositoryの削除・移管とvisibility変更はOrganization ownerだけに許可する。
- Organization ownerは必要なrepositoryを作成できる。
- public repositoryでsecret scanningとpush protectionを有効にする。
- Dependabot alertsとDependabot security updatesを有効にする。

## 理由

Organization ownerのaccountが侵害されるとrepository、secret、GitHub Appsなど広い範囲へ影響するため、全員の2FAを最低条件にする。

repository作成は現在のowner 2名だけで足りる。一般memberの作成を禁止しても既存repositoryでの開発権限には影響せず、意図しないpublic repositoryや管理対象外repositoryが増えることを防げる。

一般memberにはteam作成やrepositoryの削除・移管・visibility変更も不要である。通常の開発には`Write`または`Maintain`を使い、破壊的な設定変更が必要な人だけをownerまたはrepository Adminにする。

secret scanningとpush protectionは、secretが履歴へ入る前の防御として使う。Dependabotは脆弱な依存関係の検出と修正PR作成に使い、通常のversion updateを一律に自動化するものとは分ける。

## 検討した代替案

### 2FA未設定者がいる状態で必須化する

対象者がOrganizationへのアクセスを失う可能性があるため採用しない。本人の2FA設定完了と未設定者0人を確認してから必須化する。

### 一般memberにもrepository作成を許可する

現時点ではowner 2名が作成できれば運用できる。管理対象外repositoryが増える余地を残す必要がないため採用しない。

### Dependabotを使わない

依存関係の脆弱性を人手だけで追う負担が大きいため採用しない。alertとsecurity updateを有効にし、修正PRはCIと内容を確認してからmergeする。

## トレードオフ

- 新しいmemberは2FA設定を終えるまでOrganizationへ参加できない。
- 一般memberが新しいrepositoryを必要とする場合はownerへ作成を依頼する必要がある。
- 一般memberがteam作成やrepositoryの破壊的な設定変更を必要とする場合はownerへ依頼する必要がある。
- GitHub Freeでは、repository Adminによるoutside collaborator招待をOrganization ownerだけに制限できない。Admin roleを必要最小限にすることで補う。
- Dependabot security updateによりPRが自動作成される場合がある。
- push protectionがsecretらしい文字列を検出した場合、push前に確認または修正が必要になる。

## テスト・検証内容

- Organization ownerが`iwasawarenji954`と`tmy-banguri`の2名であることを確認した。
- 2FA未設定memberが0人であることを確認した。
- Organizationへのアクセスで2FAが必須になっていることを確認した。
- default repository permissionが`Read`であることを確認した。
- 一般memberのrepository作成権限が`none`であることを確認した。
- 一般memberのteam作成が無効であることを確認した。
- repositoryの削除・移管とvisibility変更がOrganization ownerだけに制限されていることを確認した。
- `hogedd-web`でsecret scanningとpush protectionが有効であることを確認した。
- Dependabot alertsとsecurity updatesが有効で、設定時点のalertが0件であることを確認した。

## 今後の見直し条件

- Organization ownerが1名になるとき。
- memberへrepository作成権限が必要になったとき。
- private repositoryを追加するとき。
- Dependabot alertまたはsecret scanning alertが発生したとき。
- GitHubの無料planで利用できるsecurity機能が変わったとき。
