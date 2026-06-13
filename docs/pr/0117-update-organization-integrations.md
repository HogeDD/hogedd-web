# Organization移管後のGitHubとVercel連携を更新する

## 背景

GitHub repositoryを個人アカウント`iwasawarenji954/hogedd-web`からOrganization`HogeDD/hogedd-web`へ移管した。GitHubは旧URLをredirectするためGit操作は継続できたが、ローカルremote、現行ガイド、Vercel Git integrationには旧ownerが残っていた。

## 決定したこと

- GitHub repositoryの正規名を`HogeDD/hogedd-web`とする。
- ローカル`origin`を`git@github.com:HogeDD/hogedd-web.git`へ変更する。
- Vercel projectは既存のHobby team`iwasawa-renjis-projects`に残す。
- Vercel Git integrationだけを`HogeDD/hogedd-web`へ再接続する。
- GitHub Organization SettingsでVercel GitHub Appへ対象repositoryのaccessを付与してから再接続する。
- 移管後の検証PRでGitHub ActionsとVercel Previewの両方を確認する。

## 理由

旧Git URLはredirectで動くが、正式なownerをremoteとdocsへ反映しないと、redirect終了や権限調査時に混乱する。Vercel project ID、domain、deployment historyは既存projectに紐づいているため、projectを作り直さずGit接続だけを修復する。

GitHub OrganizationとVercel teamは別サービスの所有境界であり、名前やmember構成を一致させる必要はない。Hobby利用を維持し、GitHub App accessだけをOrganizationへ追加する方が変更範囲が小さい。

## 検討した代替案

### 旧Git URLをredirectのまま使う

当面は動くが、設定画面やdocsに旧ownerが残り、正式な接続先が分かりにくいため採用しない。

### Vercel projectを新規作成する

Git接続は確実に作り直せるが、custom domain、deployment history、project ID、環境設定の移行が必要になるため採用しない。

### Vercel projectを別teamへ移管する

Organization運用と名前を揃えられるが、現在のHobby teamで支障がなく、GitHub移管とは独立した判断なので採用しない。

## トレードオフ

- GitHub Organization memberとVercel team memberは別々に管理する必要がある。
- Vercel GitHub AppのOrganization access付与は、GitHubへログインできるOrganization ownerの手作業が必要になる。

## テスト・検証内容

- 新しい`origin`から`main`と`dev`を取得できることを確認した。
- `protect-main-dev` rulesetと必須`Web` checkが移管後も有効であることを確認した。
- Actionsのdefault permissionがread-onlyであることを確認した。
- Vercel project、Production deployment、custom domainが変更前に正常であることを確認した。
- Vercel GitHub Appへ`hogedd-web`のaccessを付与し、既存projectを`HogeDD/hogedd-web`へ再接続した。
- Vercel project APIでGit ownerが`HogeDD`、repository IDが移管前と同じ、Production Branchが`main`であることを確認した。
- 既存Production deploymentが`READY`で、`hogedd.com`から`www.hogedd.com`への308 redirectと`www`の200 responseが維持されていることを確認した。
- 検証PRでGitHub ActionsとVercel Previewを確認する。

## 今後の見直し条件

- Vercel projectへ複数人が管理アクセスを必要とするとき。
- Hobby planを継続できない利用形態になったとき。
- GitHub OrganizationとVercel teamのmember差によって運用上の問題が出たとき。
