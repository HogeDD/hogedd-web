# Vercel Hobbyへ試験deploy

## 背景

TypeScript完全移行が完了し、HogeDDをNode.jsとnpmだけでbuildできる状態になった。次の段階として、費用と運用負荷を抑えて公開できる本番環境を検証する必要がある。

`hogedd.com`は取得済みで、DNSもVercelを向いていたが、対応するVercel projectとdeploymentが存在せず`DEPLOYMENT_NOT_FOUND`になっていた。

## 決定したこと

- Vercel Hobbyで非商用公開を開始する。
- Vercel project名は`hogedd-web`とする。
- repository rootをRoot Directoryとする。
- Node.jsは`.node-version`と同じ`24.x`を使う。
- GitHub repository `iwasawarenji954/hogedd-web`と連携する。
- Production Branchは`main`とする。
- `main`以外のbranchはPreview deploymentとする。
- PreviewはVercel Authenticationで保護する。
- 正規URLは`https://www.hogedd.com/`とする。
- `https://hogedd.com/`は`www`へ308 redirectする。
- Vercel固有backend serviceは導入しない。

## 理由

VercelはNext.jsとの統合、GitHub連携、Preview deployment、HTTPS付きcustom domainを少ない設定で利用できる。現在の規模では、自前serverや複数serviceを運用するより、保守時間を小さくできる。

`www`をprimaryにするとCNAMEを利用できる。Vercel公式も、CDNがtrafficを制御しやすく信頼性、速度、security面で有利な構成として、apexから`www`へのredirectを推奨している。

Productionを`main`へ限定することで、既存のIssue、PR、CI、release権限の流れと一致する。

Previewは未公開の変更や将来のsecretを含む可能性があるため、常時公開しない。Vercelへ参加していない人への一時共有はngrokを使う。

## 検討した代替案

### apex domainをprimaryにする

短いURLになるが、既存UIの共有URLはすでに`www.hogedd.com`を使っている。Vercelの推奨構成とも一致するため採用しない。

### CLIから毎回deployする

GitHubのPR、commit、CIとdeploymentの対応が追いにくい。初回bootstrap以外はGit連携を正規手順とする。

### Vercel Proから開始する

収益化をまだ行わず、現在のtrafficも小さいためHobbyから始める。広告、affiliate、有料機能を始める前に最新規約とPro移行を確認する。

### Vercel固有backend serviceを使う

移行可能性とClean Architectureの境界を守るため採用しない。

## トレードオフ

- Hobbyは非商用利用に限定される。
- HobbyではSpend Managementを利用できない。
- 上限へ達した場合に追加課金で継続するのではなく、利用回復まで待つ可能性がある。
- Vercel Functionsのserver memoryは永続化やinstance間共有を保証しない。
- Clean Tasksとランダムonline対戦は、本番ではdemoまたは試験機能として扱う。
- 初回Productionはdomain疎通のため作業branchからCLIでbootstrapした。以後は`main`から自動deployする。

## テスト・検証内容

- Vercel上で`npm run build`が成功。
- `/`、`/apps`、`/apps/chinchin`、`/apps/clean-tasks`が`200`。
- Clean TasksのGET、POST、PATCHがVercel Functions上で成功。
- Git pushからPreview deploymentが自動生成され、認証付きアクセスで主要ページとRoute Handlerが成功。
- `www.hogedd.com`が`200`。
- `hogedd.com`が`www.hogedd.com`へ`308` redirect。
- domain ownershipとHTTPSがVercelでverified。
- Production Branchが`main`であることをAPIから確認。
- Productionに必須の環境変数がないことを確認。
- スマホ相当のbrowser幅でhomeを確認し、overflowや重なりがないことを確認。

## 今後の見直し条件

- 広告、affiliate、有料機能を導入するとき。
- Hobbyの使用量上限へ近づいたとき。
- PostgreSQLを導入するとき。
- FunctionとDBのregionを決めるとき。
- server memoryを使う機能へ永続性または安定したmulti-user動作が必要になったとき。
- Vercel以外の方が費用または運用面で有利になったとき。
