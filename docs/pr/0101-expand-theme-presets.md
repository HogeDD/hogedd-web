# 0101: カラーテーマを23種類へ拡張し、コントラスト要件をテストで強制する

## 背景

`appThemePresets`は5種類(hogedd / ocean / plum / sunset / indigo)しかなく、ピンク系・オレンジ系などの明るい配色が無かった。#101で「落ち着いた・上品・ポップなど複数系統で15種類くらい、直感でわかる名前」が求められ、レビュー中に「LINEやTinderくらいのビビッド系を8種類」「ネオンではなくマットな明るさ」という要望が追加された。

## 決定したこと

- 18テーマを追加し、合計23種類にした。
  - 上品: sakura(桜) / lavender(藤) / wine(葡萄酒)
  - 明るい・ポップ: coral(珊瑚) / mikan(蜜柑) / lemon(檸檬) / mint(薄荷) / sky(空)
  - 落ち着いた: matcha(抹茶) / sumi(墨)
  - マットで明るい: melon / flamingo / tomato / carrot / himawari / soda / ruri / grape
- コントラスト要件を`test/unit/apps/app-theme.test.ts`で全preset一括検証する形に拡張した。
  - 4.5:1以上: `foreground/background`、`muted/background`、`白文字/accent`(AGENTS.md明文ルール)、`foreground/surfaceStrong`、`muted/surfaceStrong`、`accent/background`(節ラベル用)
  - 3:1以上: `highlight/accent`(accentヘッダー上のラベル用。既存presetの実績最小値3.88に合わせ、WCAG AAの大きい文字・UI部品基準を採用)
  - presetが15種類以上あること、accentが重複しないこと
- ビビッド系の設計: 鮮やかな色の主役は`highlight`と背景ティント(`background` / `accentSoft` / `surfaceStrong` / `border`)が担い、`accent`は同系統の深い色に保つ。マット版ではhighlightに白を、accentにグレーを少量混ぜる。

## 理由

- 「accent上の白文字4.5:1」を守る限り、LINE緑(#06c755)のような高明度ビビッドを`accent`(ヘッダー背景)に使うことは物理的に不可能(白文字とのコントラストが約2:1)。LINEアプリ自体がWCAG AA非準拠であり、ルールを守る範囲での最大のビビッド表現として「highlightと背景が鮮やかさを担う」構成を選んだ。
- 配色ルールを散文のままにせず、#97の方針(散文ルールを型・テストへ降ろす)に従いテストで機械検証する。今後誰がテーマを追加しても、読めない配色はCIで落ちる。
- 名前は日本語話者が直感で色を想像できる語(食べ物・自然)で統一し、コード内コメントで系統を補足した。

## 検討した代替案

- **`accentForeground`(accent上の文字色)tokenを追加し、明るいaccent+濃色文字を許す**: LINEそのままの緑ヘッダーが可能になるが、`AppTheme`の仕様変更と全shell・コンポーネントの`text-white`書き換えが必要。今回のIssue範囲を超えるため見送り。ビビッド要望が再燃した場合の見直し候補。
- **ネオン版(彩度・明度最大)**: 一度実装したが、ユーザーレビューで「マットな明るさ」へ方向修正。蛍光色は highlight/accent 3:1の制約でaccentが暗くなり、ギラつきも好まれなかった。
- **highlightを全テーマ金色系で統一し続ける**: 既存5テーマの統一感はあるが、ビビッド系統の表現力が出ないため、ビビッド8種に限り同系統の鮮やかな色をhighlightへ割り当てた。

## トレードオフ

- `highlight/accent`は4.5:1ではなく3:1を採用した(既存presetも3.88〜で4.5未満のため)。accentヘッダー上のhighlightラベルは小さい文字であり、厳密なAAには満たない。将来問題になればhighlightの明度を上げるかラベルの文字サイズで対応する。
- ビビッド系のaccentは本家ブランド色より深い。白文字契約を守る限りこれが上限で、それ以上は`accentForeground`導入(仕様変更)が必要。
- テーマ数が23に増え、選択肢過多の懸念がある。用途別の推奨は実アプリでの使用実績を見てから検討する。

## テスト・検証内容

- `app-theme.test.ts`: 23テーマ × 7ペアのコントラスト検証、種類数、accent重複なし。全68件通過。
- `format:check` / `lint` / `typecheck` / `build` 通過。
- WCAG相対輝度の計算スクリプトで設計時に全値を数値検証してから実装した。

## 今後の見直し条件

- 実アプリへ適用して視認性・印象を確認し、必要ならトーンを微調整する。
- 「ヘッダーそのものを高明度ビビッドにしたい」要望が出たら、`accentForeground` token追加を別Issueで設計する。
- テーマが30種類を超えるなら、系統別のグルーピングやプレビューページの整備を検討する。
