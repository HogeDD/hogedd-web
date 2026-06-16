# 0130: app themeを明るいブランド色と白文字へ見直す

## 背景

既存のapp themeは、accent上の白文字へ一律にcontrast比`4.5:1`以上を求めた経緯から、accentが全体的に暗かった。#127で`accentText`と`accentForeground`を分離した後も、珊瑚themeでは明るいオレンジへ濃い文字を載せたため、LINEやTinderのような明るいブランド色に白文字が映える印象にならなかった。

## 決定したこと

- `hogedd`以外のaccentを、元の色相を保ちながらワントーン明るくする。
- accent背景上の文字は白い`accentForeground`を使う。
- ブランド色として使うaccentと白文字のcontrast比は`3:1`以上とする。
- 本文、補助文字、通常背景上の`accentText`は`4.5:1`以上を維持する。
- 通常背景上のaccentラベルには、明るくする前の濃い色を`accentText`として使う。
- preset keyは`sunset`、`coral`、`sumi`など短い英語名を維持する。
- 全presetを同じ部品で比較できる開発専用の`/theme-preview`を追加する。

## 理由

白文字との`4.5:1`をaccentへ一律に求めると、高明度のブランド色を使えない。本文の可読性は従来どおり守りつつ、accentを大きな色面、選択状態、buttonとして視覚的に強く使う箇所では`3:1`を採用することで、明るさと白文字の印象を優先する。

`accentText`を別に持つため、通常背景上の小さいラベルまで明るい色になって読みにくくなることはない。名前だけで色を判断しにくい点は、実際のUI部品を一覧できるpreviewページで補う。

## 検討した代替案

### 明るいaccentへ濃い文字を載せる

contrast比は高くできるが、輪郭と文字が強くなり、求めるブランド表現から離れたため採用しない。

### 全themeに明暗presetを追加する

選択肢が倍増し、現在の利用数に対して管理負担が大きい。まず既存presetを明るい方向へ更新し、暗いthemeが具体的に必要になった時点で同系色の別presetを追加する。

### preset keyを日本語名にする

コード上で色を直接選ぶときの一覧性より、既存の短いkeyと一般的な色名を維持することを優先した。色の細かな印象はpreviewページで確認する。

### accent上の白文字も`4.5:1`を維持する

既存と同じ暗さへ戻るため採用しない。本文の基準とは分けて扱う。

## トレードオフ

- accent上の通常サイズの白文字はWCAG AAの`4.5:1`を満たさない場合がある。
- 黄色系は白文字とのcontrastを保つため、赤や青ほど高明度にはできない。
- previewページは開発時だけ表示し、productionでは404にする。

## テスト・検証内容

- 全presetの本文、補助文字、`accentText`が背景と`4.5:1`以上であること。
- 全presetの`accentForeground`がaccentと`3:1`以上であること。
- accentが背景と`3:1`以上であること。
- preset keyが短い英語名であること。
- 開発時の`/theme-preview`で全presetを比較できること。
- ニシ打と柔道ルーレットのApp / About / Guideをdesktopで確認する。
- mobileで横overflowがないことを確認する。
- `format:check`、`lint`、`typecheck`、`npm test`、`build`を実行する。

## 今後の見直し条件

- accent上の白文字について、可読性の問題が実利用で確認されたとき。
- dark themeまたは同色相の明暗presetが具体的に必要になったとき。
- preset数が増え、一覧previewや用途別分類が必要になったとき。
