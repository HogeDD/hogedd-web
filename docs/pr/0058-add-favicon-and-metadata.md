# faviconとMetadataを整備する

## 背景

Next.js初期状態のfaviconと旧descriptionが残り、ブラウザ、ホーム画面追加、検索結果、SNS共有でHogeDDのブランド情報が統一されていなかった。

## 決定したこと

- 正規URLを`https://www.hogedd.com/`とする。
- 共通descriptionを「人は欲望によって進歩する。見たことないアプリを今スグ試そう。」とする。
- file-based metadataでfavicon、通常アイコン、Apple Touch Icon、共通OG画像を配置する。
- 各ページのtitle、description、canonical URL、Open Graph、Twitter Cardを同じページ情報から生成する。
- 公開中の4ページを`sitemap.xml`へ掲載し、`robots.txt`から案内する。
- Twitter Cardは共通OG画像を使う`summary_large_image`とする。

## 理由

Next.jsのfile-based metadataを使うと、画像の形式や寸法を基に必要なhead要素が自動生成される。ページMetadataは生成関数へ集約し、通常のtitleやdescriptionだけを変更してOGやTwitterの情報が古いまま残ることを防ぐ。

サイトは静的な公開ページが4ページだけなので、robotsとsitemapは小さなTypeScriptファイルで明示する方が現在の構成を把握しやすい。正規URLを共通定数から組み立てることで、`www`なしのURLが混ざることも防ぐ。

## 検討した代替案

### `public`配下の画像をMetadataへ手動指定する

利用できるが、URL、画像寸法、MIME typeを個別に管理する必要がある。Next.jsの規約で自動生成できるため採用しない。

### robotsとsitemapを追加しない

小規模サイトでは必須ではないが、正規URLと公開ページが確定しており、追加コストも小さい。今回のMetadata整備に含める。

### 各アプリ専用のOG画像を作る

ページごとのtitleとdescriptionは設定するが、画像制作の範囲が広がるため今回は共通画像だけを使う。

## トレードオフ

- 公開ページを追加した場合は`sitemap.ts`も更新する必要がある。
- 全ページで同じOG画像を使うため、画像だけでは共有先のアプリを判別できない。
- Apple Touch Iconはfaviconと同じ図柄を使うため、専用デザインが必要になった場合は差し替えが必要になる。

## テスト・検証内容

- Metadata生成関数、正規URL、robots、sitemapのunit test。
- Prettier、ESLint、TypeScript、Vitest、Next.js production build。
- desktopとmobileで主要ページ、favicon、Metadata、OG画像を確認する。

## 今後の見直し条件

- 公開ページを追加または削除するとき。
- アプリごとのSNS共有画像が必要になったとき。
- ブランドコピーまたは正規ドメインを変更するとき。
