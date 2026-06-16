# #74 共通レイアウトへアプリテーマを適用できるようにする

## 背景

アプリごとの世界観を表現しながら量産しやすさとサイト全体の統一感を保つため、共通レイアウトは固定し、変更可能な範囲を色に限定する必要があった。

## 決定したこと

- テーマは`AppTheme`として9個の意味色で表現する。
- テーマは`AppPageShell`でCSS custom propertiesへ変換し、アプリroute全体へ適用する。
- 緑と黄色を組み合わせた現在の配色をdefault themeにする。
- defaultを含む5種類のpresetを用意する。
- presetにない配色は`createAppTheme`でdefaultとの差分だけ指定できるようにする。
- レイアウト、余白、フォント、任意class、自由なCSSはテーマinterfaceへ含めない。

## 理由

既存UIはすでにCSS custom propertiesを参照しているため、Tailwind classを動的に組み立てず、Server Componentのまま小さな変更でテーマを適用できる。意味色を明示することで、単なる色配列より利用箇所とcontrastの責務も分かりやすい。

## 検討した代替案

- Tailwind classの組をテーマとして渡す方法。
- accentなど少数の色だけ指定し、残りを実行時に自動生成する方法。
- 利用者が画面上でテーマを選択する機能。

Tailwind classの受け渡しはレイアウト変更まで許しやすい。色の自動生成はcontrastを予測しづらい。利用者向けテーマ選択は現在のIssueに必要ないため採用しなかった。

## トレードオフ

- 独自テーマでは9色すべてを意識する必要がある。
- `createAppTheme`で一部だけ変更できるが、変更後の組み合わせは開発者がcontrastを確認する必要がある。
- preset追加時はテスト対象が増える。

## テスト・検証内容

- default themeが既存のCSS変数と一致すること。
- 独自色がdefault themeへ安全に上書きされること。
- themeが期待するCSS custom propertiesへ変換されること。
- 全presetで通常文字、補助文字、active navigationがcontrast比`4.5:1`以上になること。
- desktopとmobileで既存アプリのレイアウトが変わらないこと。

## 今後の見直し条件

- 実際のアプリで色以外の差分が繰り返し必要になった場合。
- 配色の自動生成や利用者によるテーマ切り替えがプロダクト要件になった場合。
