# OG画像制作ガイド

アプリ専用のOpen Graph画像は、YouTubeサムネイルと同じ制作導線で用意する。

従来はCanvaテンプレートから手作業で作っていたが、現在は別リポジトリのサムネ自動生成ツールでYouTubeサムネイルとOG画像を同時に生成する。

## 使用するもの

- サムネ自動生成ツール: `HogeDD/hogedd-youtube`
- アプリ名
- キャッチコピー
- 必要に応じてアプリ画面のスクリーンショット
- HogeDDカラーとロゴ

`HogeDD/hogedd-youtube` 側の操作画面やコマンドを使い、YouTubeサムネイルと同じ素材・文言からOG画像を書き出す。

## 出力仕様

OG画像は、repositoryへ格納する実ファイルで次の条件を満たす。

```text
- サイズ: 1200×630 px
- 形式: PNG
- ファイル名: opengraph-image.png
- 重要な文字やロゴ: SNSで端が切り抜かれても読めるよう中央寄りに置く
```

X Cardには同じ画像を使うため、`twitter-image.png`も同じ内容・同じ実寸にする。

## 作り方

1. `HogeDD/hogedd-youtube` のサムネ自動生成ツールを開く。
2. 対象アプリのアプリ名、キャッチコピー、必要なスクリーンショットを入力する。
3. YouTubeサムネイルとOG画像を同じタイミングで生成する。
4. 書き出したOG画像が `1200×630` のPNGであることを確認する。
5. alt文を決める。
6. 対象アプリのroute segmentへ画像とaltを保存する。

ツール側の操作方法が変わった場合は、このリポジトリではなく `HogeDD/hogedd-youtube` 側のREADMEまたはIssueコメントを正とする。このガイドでは、hogedd-webへ受け渡す画像の条件と保存場所を定義する。

## スクリーンショット

- 本番へ出す状態と同じ内容を表示する。
- desktopとmobileのどちらを使う場合も、同じアプリだと分かる画面を選ぶ。
- 個人情報、token、開発者ツール、ブラウザ拡張などを写さない。
- カーソル、選択範囲、不要な通知を残さない。
- 文字や主要UIが端で切れていないことを確認する。

## 書き出し後

PNGとaltを、対象アプリのroute segmentへ次の4ファイルとして格納する。

```text
app/apps/<app-name>/opengraph-image.png
app/apps/<app-name>/opengraph-image.alt.txt
app/apps/<app-name>/twitter-image.png
app/apps/<app-name>/twitter-image.alt.txt
```

Open GraphとX Cardには同じ画像とaltを使う。ツールから書き出したOG画像を複製し、画像を別々に編集しない。

altは、装飾や配置を細かく説明するのではなく、アプリ名と画像の内容が短く伝わる文章にする。

格納後は次を確認する。

```bash
file app/apps/<app-name>/opengraph-image.png
npm run test:release
```

`file`の結果が`PNG image data, 1200 x 630`であること、release testで画像とaltの不一致が報告されないことを確認する。

## 旧Canva手順の扱い

Canvaテンプレートを使う旧手順は現在の正規手順ではない。

過去の編集データは履歴としてCanva側に残してよいが、新しく公開準備へ進めるアプリでは、サムネ自動生成ツールからOG画像を書き出す。

画像の保存場所、形式、権利に関する共通ルールは`docs/guides/assets.md`を参照する。
