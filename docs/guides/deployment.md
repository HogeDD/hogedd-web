# Vercel deploy運用ガイド

## 現在の構成

HogeDDはVercel Hobbyで公開する。

```text
GitHub: HogeDD/hogedd-web
Vercel project: hogedd-web
Vercel owner: iwasawa-renjis-projects
Framework: Next.js
Root Directory: repository root
Node.js: 24.x
Production Branch: main
Production URL: https://www.hogedd.com/
Apex domain: https://hogedd.com/ -> wwwへ308 redirect
```

VercelはhostingとNext.jsの実行環境として使う。Vercel Blob、KV、Edge Config、Queues、Workflowなどをアプリケーションの標準backendとして使わない。

GitHub OrganizationとVercel teamは別の所有境界である。GitHub repositoryをOrganizationへ移管しても、Vercel project ownerを同名teamへ移す必要はない。現在はHobby team`iwasawa-renjis-projects`でproject、domain、deploymentを維持し、Git integrationだけを`HogeDD/hogedd-web`へ接続する。

GitHub repositoryの移管後は、Organization SettingsのInstalled GitHub AppsでVercelへ対象repositoryのaccessを付与する。その後、Vercel Project SettingsのGitまたはCLIでrepositoryを再接続する。

```bash
npx vercel@latest git connect https://github.com/HogeDD/hogedd-web.git \
  --scope iwasawa-renjis-projects
```

接続後はVercel project APIの`link.org`が`HogeDD`、`productionBranch`が`main`であることを確認する。

## Branchとdeployの対応

```text
feature/*, fix/*, docs/*, infra/*
        |
        | PR
        v
       dev --------------------> Preview deployment
        |
        | release PR
        v
       main -------------------> Production deployment
                                  www.hogedd.com
```

- `main`以外へのpushはPreview deploymentになる。
- PRにはVercelのPreview URLが紐づく。
- PreviewはVercel Authenticationで保護し、Vercelへ参加している開発者だけが確認する。
- `main`へのmergeでProduction deploymentが作られる。
- custom domainは最新のProduction deploymentを表示する。
- 通常運用では`vercel --prod`を使わない。
- 初回project作成時だけ、domain疎通確認のためCLIからbootstrap deploymentを行った。

## 通常のdeploy手順

### 1. 開発PR

1. Issueを作る。
2. `dev`から作業branchを切る。
3. ローカルで実装と検証を行う。
4. branchをpushし、`dev`向けPRを作る。
5. GitHub Actionsの`Web` checkを確認する。
6. Vercel Previewで対象画面とRoute Handlerを確認する。
7. `dev`へsquash mergeする。

### 2. Production release

1. `dev`から`main`へのrelease PRを作る。
2. 差分とGitHub Actionsの`Web` checkを確認する。
3. release PRのPreviewで主要ページを確認する。
4. `iwasawarenji954`が`Create a merge commit`で`main`へmergeする。
5. VercelのProduction deploymentがReadyになるまで待つ。
6. `https://www.hogedd.com/`で主要ページとRoute Handlerを確認する。

`main`へ直接pushしない。Productionを急いで直す場合も、原則としてfix branch、`dev`、release PRの履歴を残す。

### mainへmergeするときのGitHub操作

開発PRとrelease PRではmerge方法が異なる。

| PR             | 向き先             | 選ぶ操作                |
| -------------- | ------------------ | ----------------------- |
| 通常の開発PR   | 作業branch → `dev` | `Squash and merge`      |
| 本番release PR | `dev` → `main`     | `Create a merge commit` |

release PRをmergeするとき:

1. PRのbaseが`main`、compareが`dev`であることを確認する。
2. `Web`とVercelのcheckが成功していることを確認する。
3. mergeボタン右側の選択肢を開く。
4. `Create a merge commit`を選ぶ。
5. 表示が`Merge pull request`になったことを確認する。
6. `Merge pull request`、`Confirm merge`の順に押す。
7. `Squash and merge`は選ばない。

`dev`から`main`をsquash mergeすると、`main`に元の`dev` commitとの親子関係が残らない。次回のrelease PRで同じ変更が再表示され、conflictの原因になる。releaseではmerge commitを使い、`dev`の履歴を`main`へ引き継ぐ。

release後も`dev`を削除しない。`dev`は長期branchであり、次の開発を続ける場所である。

### release PRがconflictしたとき

次の操作は行わない。

- `main`へ直接pushする。
- ローカル`main`で`git pull --rebase`を続ける。
- `dev`を`main`へrebaseする。
- conflictをGitHub画面だけで推測して解決する。
- rulesetを一時的に無効化する。

まず作業を止め、release PRへconflictしていることをコメントする。過去にreleaseをsquash mergeしたことが原因なら、`main`起点の一時的な`release/*` branchで`dev`をmergeし、内容を`dev`と一致させたmerge commitを作る。そのbranchから`main`へPRを作り、`Create a merge commit`でmergeする。

この復旧操作は履歴とファイル内容の両方を確認する必要があるため、慣れていない場合は手作業で進めずAIまたは経験者へ依頼する。

## Preview確認項目

- `/`
- `/apps`
- `/apps/chinchin`
- 対象となる各アプリページ
- 変更したRoute Handler
- mobile幅でoverflowや重なりがないこと
- browser consoleとVercel runtime logsに新しいerrorがないこと

UIを変更していないPRでは、変更したserver処理と主要ページが表示できることを確認する。

Preview URLはVercel Authenticationで保護されている。Vercelへ参加していない人や外部スマホへ一時共有する場合は、Preview protectionを常時解除せず、`docs/guides/local-dev.md`のngrok手順を使う。

CLIから認証付きPreviewを確認する場合:

```bash
npx vercel@latest curl / --deployment <PREVIEW_URL>
```

## Domain

正規URLは`www.hogedd.com`とする。Vercelも、CNAMEを利用できる`www`をprimary domainにし、apexからredirectする構成を推奨している。

現在の設定:

- `www.hogedd.com`: Vercel projectのProductionへ割り当て
- `hogedd.com`: `www.hogedd.com`へ308 permanent redirect
- DNS provider: お名前.com
- nameserver: お名前.com側を維持

DNS値を変更する場合は、一般値を決め打ちせず、Vercel Project SettingsのDomains画面または次のinspect結果を正とする。

```bash
npx vercel@latest domains inspect hogedd.com
npx vercel@latest domains inspect www.hogedd.com
```

DNS変更は反映に時間がかかることがある。反映確認:

```bash
curl -I https://hogedd.com/
curl -I https://www.hogedd.com/
```

期待結果:

- apexは`308`で`https://www.hogedd.com/`へredirectする。
- `www`は`200`を返す。
- HTTPS certificate errorがない。

## 環境変数とsecret

ProductionではAuth0認証のために次の環境変数を設定する。

| key                   | 種別   | 用途                                             |
| --------------------- | ------ | ------------------------------------------------ |
| `AUTH0_DOMAIN`        | Config | Auth0 tenant domain                              |
| `AUTH0_CLIENT_ID`     | Secret | HogeDD Web ApplicationのClient ID                |
| `AUTH0_CLIENT_SECRET` | Secret | HogeDD Web ApplicationのClient Secret            |
| `AUTH0_SECRET`        | Secret | session cookieを暗号化するランダムな32 byteの値  |
| `APP_BASE_URL`        | Config | Productionのorigin（`https://www.hogedd.com`）   |
| `AUTH0_AUDIENCE`      | Config | HogeDD APIのaudience（`https://api.hogedd.com`） |

`AUTH0_SECRET`は次のコマンドで生成し、生成結果をrepositoryへ保存せずVercelへ直接登録する。

```bash
openssl rand -hex 32
```

Auth0のHogeDD Web Applicationには次のURLを設定する。

- Allowed Callback URLs: `https://www.hogedd.com/auth/callback`
- Allowed Logout URLs: `https://www.hogedd.com`

環境変数の追加・変更は既存deploymentへ遡って反映されない。設定後に新しいdeploymentを作成する。

環境変数を追加するとき:

1. Vercel Project SettingsのEnvironment Variablesを開く。
2. Production、Preview、Developmentの対象を選ぶ。
3. secretの実値はVercelへ入力する。
4. key名だけを`.env.example`へ追加する。
5. PreviewとProductionで必要な値が異なる場合は分ける。
6. 変更後に再deployして反映を確認する。

`NEXT_ALLOWED_DEV_ORIGINS`はローカルdev server用なのでVercelへ設定しない。

secretをIssue、PR、docs、log、screenshotへ載せない。漏洩した場合は履歴修正より先にrevokeまたはrotateする。

## Hobby planの運用

2026年6月16日時点のVercel公式情報では、Hobbyは非商用のpersonal use向けである。

- 広告を掲載しない。
- affiliate linkを掲載しない。
- 有料機能を提供しない。
- 収益化前に最新のVercel規約を再確認し、必要ならProへ移行する。
- Web AnalyticsはHobbyの無料枠内で使う。
- HobbyではSpend Managementを利用できない。
- 使用量上限へ達した場合、多くの機能は次の利用期間まで待つ必要がある。
- DashboardのUsageを定期的に確認する。

上限値は変更されるためdocsへ固定せず、公式のHobby planページを確認する。

- https://vercel.com/docs/accounts/plans/hobby
- https://vercel.com/docs/limits/overview
- https://vercel.com/docs/analytics/limits-and-pricing

## Web Analytics

Vercel Web Analyticsでサイト訪問状況を確認する。

運用:

- コード側では`@vercel/analytics`を使い、root layoutで全ページへ`Analytics`を組み込む。
- Vercel Project DashboardのAnalyticsでWeb Analyticsを有効化する。
- 有効化後にdeployされたページビューからDashboardへ反映される。
- GA4は使わない。
- Hobby無料枠の範囲で使い、上限や課金条件が変わった場合は継続可否を確認する。

確認:

1. `main`へのrelease後、Vercel Project DashboardのAnalyticsを開く。
2. Web Analyticsが有効になっていることを確認する。
3. `https://www.hogedd.com/`へアクセスする。
4. Dashboardでページビューが記録されることを確認する。

## 現在の制約

Clean Tasksは、server memoryへ状態を保存している。

Vercel Functionsでは次を保証できない。

- server再起動後も状態が残ること
- 複数instanceで同じ状態を共有すること
- deploy後も状態が残ること

そのため、Clean Tasksはdemo扱いとする。永続性が必要になったら、交換可能なrepository境界を保ったままPostgreSQLなどへ移す。

## Logsと障害確認

問題が起きたら次の順で確認する。

1. GitHub Actionsの`Web` check
2. Vercel deploymentのBuild Logs
3. Vercel Runtime Logs
4. browser consoleとNetwork
5. custom domainではなくdeployment固有URLでも再現するか

Preview deploymentをCLIで確認する場合は`vercel curl`を使う。bypass tokenはsecretとして扱い、出力やdocsへ保存しない。

secretや個人情報をlogへ出さない。

## Rollback

Productionで問題が起きた場合:

1. 影響範囲を確認する。
2. Vercel DashboardのDeploymentsから直前の正常deploymentへrollbackする。
3. GitHubで原因となった変更をrevertするIssueとPRを作る。
4. `main`とVercel Productionの内容を再び一致させる。
5. 同じ問題を防ぐtestまたはCI ruleを追加する。

Vercel上のrollbackだけで終わらせない。Git履歴を正しい状態へ戻す。

## 公式資料

- Git連携: https://vercel.com/docs/deployments/git
- Custom domain: https://vercel.com/docs/domains/set-up-custom-domain
- Domain redirect: https://vercel.com/docs/projects/domains/deploying-and-redirecting
- Hobby plan: https://vercel.com/docs/accounts/plans/hobby
- Limits: https://vercel.com/docs/limits/overview
