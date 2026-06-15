# OG画像制作ガイド

アプリ専用のOpen Graph画像を、HogeDDのCanvaテンプレートから作る手順をまとめる。

## 使用するもの

- CanvaのHogeDD OG画像マスターデザイン
- アプリ名
- キャッチコピー
- desktopで開いたアプリ画面のスクリーンショット
- mobileで開いたアプリ画面のスクリーンショット
- HogeDDロゴ

Canvaの編集URLは公開repositoryへ記載しない。HogeDDのCanva共有領域からマスターデザインを開くか、管理者へアクセスを依頼する。

## 作り方

1. マスターデザインを直接編集せず、Canva上で複製する。
2. 複製したデザイン名へアプリ名またはslugを含める。
3. アプリ名とキャッチコピーを差し替える。
4. Macの画面部分へdesktopのスクリーンショットを配置する。
5. iPhoneの画面部分へmobileのスクリーンショットを配置する。
6. 端末の枠内に余白や背景が残らないよう、各スクリーンショットをトリミングする。
7. HogeDDロゴ、文字、画面の主要部分が端へ寄りすぎていないことを確認する。
8. `1200×630 px`のPNGとして1枚だけ書き出す。

アプリ固有の画面と文章だけを差し替え、端末の配置、HogeDDロゴ、全体の基本レイアウトはマスターに合わせる。テンプレート自体の改善が必要な場合は、個別アプリの制作中に変更せず、別Issueで扱う。

## スクリーンショット

- 本番へ出す状態と同じ内容を表示する。
- desktopとmobileで、同じアプリだと分かる画面を選ぶ。
- 個人情報、token、開発者ツール、ブラウザ拡張などを写さない。
- カーソル、選択範囲、不要な通知を残さない。
- 文字や主要UIが端末の枠で隠れていないことを確認する。

## 書き出し後

PNGとaltを、対象アプリのroute segmentへ次の4ファイルとして格納する。

```text
app/apps/<app-name>/opengraph-image.png
app/apps/<app-name>/opengraph-image.alt.txt
app/apps/<app-name>/twitter-image.png
app/apps/<app-name>/twitter-image.alt.txt
```

Open GraphとX Cardには同じ画像とaltを使う。Canvaから書き出した1枚を複製し、画像を別々に編集しない。

altは、装飾や配置を細かく説明するのではなく、アプリ名と画像の内容が短く伝わる文章にする。

格納後は次を確認する。

```bash
file app/apps/<app-name>/opengraph-image.png
npm run test:release
```

`file`の結果が`PNG image data, 1200 x 630`であること、release testで画像とaltの不一致が報告されないことを確認する。

## Canvaデータの管理

- 編集元はCanvaのHogeDD共有領域で管理する。
- repositoryには書き出したPNGとaltだけを格納する。
- マスターデザインは直接編集せず、アプリごとに複製する。
- Canva上の素材を追加するときは、現在の利用方法で使えるライセンスか確認する。
- テンプレートへのアクセス権を変更した場合も、編集URLをIssue、PR、docsへ貼らない。

画像の保存場所、形式、権利に関する共通ルールは`docs/guides/assets.md`を参照する。
