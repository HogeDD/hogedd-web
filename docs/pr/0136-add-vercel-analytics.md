# Vercel Web Analyticsで訪問状況を確認できるようにする

## 背景

サイトへ何人来ているか、どのページが見られているかを、外部の大きな計測基盤を増やさず把握したかった。HogeDDはVercel Hobbyで公開しているため、Vercel Dashboard上で確認できるWeb Analyticsを優先して検討した。

## 決定したこと

- `@vercel/analytics`を追加する。
- Next.js App Router向けに`@vercel/analytics/next`から`Analytics`をimportし、root layoutへ配置する。
- 全ページを一括で計測対象にするため、アプリ個別のlayoutやpageには追加しない。
- Vercel Dashboard側でWeb Analyticsを有効化する。
- GA4は導入しない。
- Hobby無料枠の範囲で使い、上限や課金条件が変わった場合は継続可否を確認する。

## 理由

Vercel公式のQuickstartは、package追加、アプリへの組み込み、deploy、Dashboard確認の流れを示している。Next.jsでは`@vercel/analytics/next`をroot layoutへ追加するだけでよく、既存の画面構成やアプリごとの実装へ触れずに導入できる。

2026年6月16日時点のVercel公式情報では、Web AnalyticsはHobbyの無料枠内で使える。GA4を追加しないため、別サービスのタグ管理、プロパティ設定、Cookieまわりの判断を今回の範囲へ持ち込まずに済む。

## 検討した代替案

### GA4を使う

高機能だが、Issueのやらないことに明記されており、設定と運用の負担も増えるため採用しない。

### 独自にアクセスログを保存する

自由度は高いが、DB、個人情報、保存期間、集計UIの判断が必要になり、低侵襲ではないため採用しない。

### Vercel Dashboardだけ有効化し、packageを入れない

Dashboard側の有効化だけではアプリへ計測scriptが組み込まれないため、Quickstartに沿ってpackageも追加する。

## トレードオフ

- 訪問データはVercelの仕様とDashboardに依存する。
- Hobby無料枠の上限を超えると、継続して計測できない可能性がある。
- Dashboard側のWeb Analytics有効化はrepositoryだけでは完了できない。
- 本番反映後、実際のページビューが発生するまでDashboardで確認できない。

## テスト・検証内容

- Vercel公式docsでHobby無料枠とNext.js組み込み手順を確認する。
- Next.js 16.2.6のローカルdocsでroot layoutとServer/Client Componentsの扱いを確認する。
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## 今後の見直し条件

- Hobby無料枠やVercel Web Analyticsの料金条件が変わったとき。
- GA4や別のanalytics基盤が必要になったとき。
- 計測対象から除外したいページやURLが出てきたとき。
- privacy policyなど、公開サイト上の説明が必要になったとき。
