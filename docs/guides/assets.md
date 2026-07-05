# 画像・素材管理ガイド

HogeDDで使う画像、アイコン、スクリーンショットなどの置き場所と受け渡しルールをまとめる。

## 置き場所

画像は用途を先に確認し、所有する機能の近くへ置く。

### アプリ内部だけで使う画像

```text
app/apps/<app-name>/_assets/
```

コンポーネントからimportして使うアプリ専用画像を置く。Next.jsの`Image`へstatic importを渡すと、画像の幅と高さが自動的に取得される。

```tsx
import Image from "next/image";
import appThumbnail from "@/app/apps/example/_assets/thumbnail.webp";

<Image src={appThumbnail} alt="Exampleアプリの操作画面" />;
```

アプリ専用画像をサイト共通の`public/images/`へまとめない。複数アプリで実際に再利用することが決まるまでは、各アプリの近くで管理する。

### URLとして直接参照する画像

```text
public/apps/<app-name>/
```

CSSの`background-image`、外部へ渡すURL、JSON内のパスなど、importではなく`/apps/<app-name>/...`という公開URLが必要な場合だけ使う。

サイト全体で使うロゴなどは`public/`直下または責務が分かるサブフォルダへ置く。アプリ専用素材を`public/`直下へ並べない。

### Next.jsのMetadata画像

Next.jsのfile conventionに従い、対象のroute segmentへ置く。

```text
app/
  opengraph-image.png                 # サイト共通
app/apps/<app-name>/
  opengraph-image.png                 # アプリ専用
  opengraph-image.alt.txt
  twitter-image.png                   # 同じ画像をX Cardにも使用
  twitter-image.alt.txt
```

`favicon.ico`、`icon.png`、`apple-icon.png`などもNext.jsが指定する場所と名前を優先する。これらを整理目的で別フォルダへ移動しない。

アプリを公開準備へ進めるときは、本人へ次の条件でOG画像を依頼する。

```text
- サイズ: 1200×630 px
- 形式: PNG
- ファイル名: opengraph-image.png
- 格納先: app/apps/<app-name>/opengraph-image.png
- 重要な文字やロゴ: SNSで端が切り抜かれても読めるよう中央寄りに置く
- alt: 画像内容を短く説明する文章を一緒に渡す
```

OG画像は`HogeDD/hogedd-youtube`のサムネ自動生成ツールでYouTubeサムネイルと同時に生成し、`docs/guides/og-image-template.md`の手順に従う。repositoryには書き出したPNGとaltだけを格納する。

受け取った画像とaltを次の2組へ同じ内容で保存する。

```text
app/apps/<app-name>/opengraph-image.png
app/apps/<app-name>/opengraph-image.alt.txt
app/apps/<app-name>/twitter-image.png
app/apps/<app-name>/twitter-image.alt.txt
```

Next.jsではOpen GraphとTwitter Cardが別のfile conventionなので、片方だけではなく両方へ格納する。アプリsegmentに置くことで、metadata継承によりApp、About、Guideで同じ画像を使う。

公開済みアプリのmetadata画像は、`main`向けrelease PRと`main`へのpushで動くCIがPNG形式と`1200×630`の実寸を検査する。画像未準備の状態でも作業branchから`dev`へはmergeできるが、Productionへ出すrelease PRは通らない。ファイル名だけを合わせた別形式や、画像編集ソフト上の設定だけで判断せず、repositoryへ格納した実ファイルで検査する。

## ファイル名

- 半角英小文字、数字、ハイフンを使う。
- 拡張子を除き、`kebab-case`にする。
- 画像の役割が分かる名前にする。
- スペース、日本語、連番だけの名前を使わない。
- 同じ画像の用途違いは末尾で区別する。

良い例:

```text
thumbnail.webp
game-board.webp
task-list-mobile.webp
hero-background.avif
```

避ける例:

```text
IMG_1234.PNG
画像 最終版2.png
screen1.png
```

## サイズと形式

| 用途                         | 推奨サイズ・比率          | 推奨形式  |
| ---------------------------- | ------------------------- | --------- |
| アプリ代表画像・カード       | `1280×720`、16:9          | WebP      |
| Open Graph画像               | `1200×630`                | PNG       |
| 操作画面のスクリーンショット | 横幅`1600px`以下を目安    | WebP、PNG |
| 透過が必要なロゴ・図         | 必要な表示サイズの2倍程度 | PNG、SVG  |
| Apple Touch Icon             | `180×180`                 | PNG       |

- 写真や大きな背景画像はWebPまたはAVIFを優先する。
- UIのスクリーンショットや透過画像は、劣化が目立つ場合にPNGを使う。
- SVGは自作または内容を確認できる信頼済みファイルだけを使う。外部から受け取ったSVGを未確認で追加しない。
- 元の編集データ、PSD、AIファイルなどは、アプリの実行に必要でなければrepositoryへ入れない。
- 画像を追加する前に、表示上の違いが分からない範囲で容量を減らす。

推奨サイズは受け渡し時の基準であり、無理な引き伸ばしや切り抜きを強制するものではない。既存UIと比率が合わない場合は、画像側だけで解決せず表示方法も確認する。

## 実装時の注意

- 通常の画像表示はNext.jsの`Image`を基本にする。
- 内容を伝える画像には、用途が分かるaltを付ける。
- 装飾だけの画像は`alt=""`とし、同じ内容を読み上げさせない。
- `background-image`は装飾または意図的なトリミングが必要な場合に限る。
- mobileとdesktopの両方で、主要部分が切れていないか確認する。
- 画像差し替え後は、ブラウザとPreviewで古い画像が残っていないか確認する。

## 権利と出典

repositoryへ追加できる素材:

- HogeDDの参加者が自分で制作し、利用を許可した素材。
- HogeDD自身の画面を撮影したスクリーンショット。
- 商用・非商用を含む現在の利用方法に適合するライセンス素材。
- 利用規約を確認し、生成物の利用が許可されたサービスで作った素材。

追加しない素材:

- 検索結果やSNSから保存した、権利者と利用条件が不明な画像。
- 許可なく転載したキャラクター、写真、イラスト、ロゴ。
- attributionなど、必要なライセンス条件を満たせない素材。
- 個人情報、位置情報、token、メールアドレスなどが写ったスクリーンショット。
- 利用規約や権利関係を説明できない生成画像。

自作以外の素材を使う場合は、PR本文へ次を記載する。

```text
- 素材名
- 出典URL
- 作者または提供元
- ライセンス名
- attributionの要否と表示場所
- 加工した内容
```

判断できない素材はrepositoryへ追加せず、IssueまたはPRで確認する。

## 画像を渡すとき

最低限、次を一緒に伝える。

```text
- 使用するアプリと画面
- 用途（カード、背景、OG画像など）
- 元画像か加工済みか
- 希望する切り抜き位置
- 作者、出典、ライセンス
```

用途が未定の場合は、元画像を勝手に複数サイズへ書き出さず、必要な比率を先に決める。
