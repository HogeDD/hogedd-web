# Organization移管後のrepository metadataを整える

## 背景

GitHub repositoryをOrganization`HogeDD`へ移管した後、repositoryのDescriptionとTopicsが未設定で、WebsiteにはVercelの仮URLが残っていた。Organization profileにも名前、説明、websiteがなく、GitHub上でHogeDDの用途と正規サイトが分かりにくい状態だった。

## 決定したこと

repository`HogeDD/hogedd-web`へ次を設定する。

- Description: `Hoge Driven Development のアプリ集約サイト`
- Website: `https://www.hogedd.com/`
- Topics: `nextjs`、`typescript`、`clean-architecture`、`hogedd`

Organization profile`HogeDD`へ次を設定する。

- Name: `HogeDD`
- Description: `Hoge Driven Development`
- Website: `https://www.hogedd.com/`

repositoryのAbout欄は個別repositoryの用途と技術構成、Organization profileはHogeDD全体の説明と入口を担当する。

## 理由

GitHub上でrepositoryを見つけた人が、READMEを開く前に用途、正規サイト、主な技術構成を判断できるようにするためである。

Websiteにはdeploy providerの仮URLではなく、公開時の正規URLを設定する。Organization profileは将来repositoryが増えても使える全体説明に留め、個別repositoryの説明と役割を分ける。

## 検討した代替案

### WebsiteへVercel URLを残す

deploy先としては有効だが、公開時の正規URLではなく、利用者の入口として不適切なため採用しない。

### Organization profileへrepositoryと同じ説明を載せる

現在はrepositoryが一つでも、将来複数repositoryを持つ可能性がある。Organization全体と個別repositoryの役割が重複するため採用しない。

### Topicsを設定しない

技術構成やrepositoryの分類をGitHub上で把握しにくくなるため採用しない。

## トレードオフ

- 技術構成や正規URLが変わった場合、repository metadataも手動で更新する必要がある。
- `clean-architecture`は一部アプリへ必要な範囲で採用する方針だが、repository全体の設計方針を示すtopicとして使用する。

## テスト・検証内容

- repositoryのDescriptionが`Hoge Driven Development のアプリ集約サイト`であることをGitHub APIで確認した。
- Websiteが`https://www.hogedd.com/`であることを確認した。
- Topicsに`nextjs`、`typescript`、`clean-architecture`、`hogedd`が設定されていることを確認した。
- Organization profileのname、description、websiteが設定されていることを確認した。

## 今後の見直し条件

- 正規URLを変更するとき。
- Next.js、TypeScript、Clean Architectureの採用方針を変更するとき。
- Organization内に別のrepositoryを追加するとき。
- HogeDDの正式な説明文を変更するとき。
