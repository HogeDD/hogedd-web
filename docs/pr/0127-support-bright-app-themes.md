# 明るい配色を使えるようthemeのcontrast設計を見直す

## 背景

アプリthemeの`accent`は、背景色、装飾、focus ring、小さいラベル文字、button背景を一つの色で兼用していた。testはaccent背景上の白文字へ一律にcontrast比`4.5:1`を要求していたため、themeを明るくすると失敗し、preset全体が暗い色へ寄りやすかった。

Issue #87でcoralのaccentを明るいオレンジ`#d16f23`へ変更したところ、白文字とのcontrastは`3.49:1`だった。一方、濃い文字`#221511`とのcontrastは`5.08:1`あり、文字色を分離すれば明るさと可読性を両立できる。

## 決定したこと

- `accent`は背景、装飾、focus ring、UI境界に使う。
- `accentText`は通常背景上の小さいaccentラベルに使う。
- `accentForeground`はaccent背景上のbutton、見出し、active navigationの文字に使う。
- `accentText`未指定時は`accent`、`accentForeground`未指定時は白を使い、既存presetとの互換性を保つ。
- 通常サイズの文字は背景とのcontrast比`4.5:1`以上を維持する。
- 背景、装飾、focus ringとして使うaccentは背景と`3:1`以上を維持する。
- header上の小さいラベルはhighlightではなく`accentForeground`を使う。highlightは装飾色として扱う。
- coralはaccent`#d16f23`、accentText`#a23c28`、accentForeground`#221511`とする。

## 理由

contrast基準を一律に削除すると、button labelや小さい文字まで読みにくくなる。色の役割を分ければ、面としては明るい色を使いながら、文字には載る背景に応じた読みやすい色を選べる。

既存presetへ全て新しい色を追加せずfallbackを用意することで、現在の見た目を維持しながら、明るいthemeだけ段階的に調整できる。

## 検討した代替案

### 全contrast基準を3:1へ下げる

通常サイズの本文やbutton labelには不十分になるため採用しない。

### coralだけ暗い色へ戻す

testは通るが、明るいthemeを使いたいという問題を解決しないため採用しない。

### accentを使う文字だけ個別に色を直書きする

themeの責務が各componentへ漏れ、別presetで同じ問題が再発するため採用しない。

## トレードオフ

- theme tokenが2つ増える。
- component実装では、色を面として使うか文字として使うかを区別する必要がある。
- highlightはaccent背景上の文字色ではなく装飾用途に限定される。

## テスト・検証内容

- 全presetの通常文字、補助文字、accentText、accentForegroundが用途別のcontrast基準を満たすことをunit testで確認する。
- coralが明るいaccentと専用文字色を持つことをunit testで確認する。
- App、About、Guide、active navigation、buttonをdesktopとmobileで確認する。
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## 今後の見直し条件

- 別の明るいpresetで専用文字色が必要になったとき。
- themeにdark modeを追加するとき。
- WCAGの採用基準またはUI house styleを変更するとき。
