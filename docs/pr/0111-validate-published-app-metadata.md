# 公開準備のmetadataとOG画像を自動検査する

## 背景

新規アプリのMVP構成はIssue #81で自動検査できるようになった。一方、アプリ専用OG画像、公開日、YouTube情報などは公開準備で追加するため、未公開アプリへ一律に要求できない。公開済みアプリだけに公開要件を適用し、追加漏れをCIで検出する必要があった。

また、OG画像は本人が制作して渡す運用だが、必要なサイズ、形式、格納先を依頼時に明示する手順が不足していた。

## 決定したこと

- `publishedAppLinks`に含まれる公開済みアプリだけを公開metadata検査の対象にする。
- metadata画像は`1200×630`のPNGに固定する。
- 本人から受け取る画像は1枚とし、同じ画像とaltを`opengraph-image.*`と`twitter-image.*`の2組へ格納する。
- altは空文字を認めない。
- アプリsegmentに画像を置き、Next.jsのmetadata継承によってApp、About、Guideで共有する。
- `appHref`がslugと一致し、`publishedAt`が`YYYY-MM-DD`であることを検査する。
- YouTube URL、動画ID、サムネイルURL、共有URLは`defineAppLink`で一つの入力から生成し、個別に手入力しない現在の設計を維持する。
- 公開準備へ入ったら、本人へ画像条件を案内して格納を依頼する。
- 公開済み実データへの厳格検査は`main`向けPRと`main`へのpushでだけ実行し、通常の`dev`向けPRでは検査器のunit testだけを実行する。

## 理由

公開要件を`published`状態へ限定すると、MVP開発中の`preparing`アプリを妨げず、本番へ出すアプリだけを厳しく検査できる。PNGと実寸を固定することで、追加依存なしにCIでファイル内容を検査でき、画像の受け渡し条件も一意になる。

Next.js 16.2.6ではfile-based metadataが`metadata` objectより優先される。アプリsegmentの`opengraph-image.png`と`twitter-image.png`は親のサイト共通画像を上書きし、子segmentのAboutとGuideにも継承されるため、各ページへ同じ画像設定を重複して書く必要がない。

公開素材は人の制作待ちになるため、通常の`npm test`へ実データの完全性を含めると、途中の仕組みやdocsまで`dev`へmergeできなくなる。品質ゲートをProduction境界へ合わせ、`dev`では検査ロジックを育てられ、`main`では不足を許さない構成にする。

## 検討した代替案

### JPEGとWebPも許可する

画像ごとに適切な形式を選べるが、実寸検査に追加依存または複数形式のparserが必要になる。OG画像は1アプリ1枚であり、受け渡しの単純さを優先してPNGへ固定した。

### metadata helperへ画像URLを渡す

明示的だが、App、About、Guideの3ページで同じ設定を繰り返す。Next.jsのfile conventionとsegment継承で表現できるため採用しない。

### 未公開アプリにもOG画像を必須にする

早い段階で素材を揃えられるが、MVPと公開準備を分ける開発サイクルに反するため採用しない。

### 通常のunit testで公開済み実データも必須にする

ローカルと全PRで不足へ気づけるが、素材待ちの期間に`dev`への変更まで止めてしまう。Production境界である`main`向けrelease PRだけを失敗させる方が開発サイクルに合うため採用しない。

## トレードオフ

- JPEGやWebPで受け取った画像は、格納前にPNGへ書き出す必要がある。
- SNSごとの表示領域差まではCIで確認できないため、重要要素を中央寄りに置く判断は人の確認が必要になる。
- altの内容品質は空でないことまでしか自動判定できない。

## テスト・検証内容

- 公開済みアプリだけが検査対象になることを確認する。
- appHref、公開日、PNG形式、実寸、altが不正なfixtureで問題が報告されることを確認する。
- `preparing`アプリへ公開要件を適用しないことを確認する。
- 通常の`npm test`では画像未準備でも検査器のunit testが通り、`npm run test:release`では不足が報告されることを確認する。
- format、lint、typecheck、全unit test、buildを実行する。

## 今後の見直し条件

- OG画像の制作・変換フローを自動化するとき。
- PNGの容量が継続的な問題になり、JPEGやWebPを許可する必要が出たとき。
- 公開状態を`app-links`以外で管理するようになったとき。
