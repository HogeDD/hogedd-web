# PostCSSのaudit警告を解消

## 背景

Next.js 16.2.6が内部で利用するPostCSS 8.4.31に、`GHSA-qx2v-qp2m-jg93`が報告された。

影響範囲はPostCSS 8.5.10未満で、`npm audit`ではmoderate severityが2件表示されていた。`npm audit fix --force`が提示するNext.js 9.3.3への変更は、安全な修正ではない。

## 決定したこと

- npmの`overrides`でPostCSS 8.5.15を指定する。
- Next.js内部を含むPostCSSを、修正済みの同一versionへ統一する。
- Next.jsをdowngradeしない。
- auditを通すためにCIや検査条件を緩めない。

## 理由

2026年6月6日時点の最新安定版Next.js 16.2.7も、内部依存はPostCSS 8.4.31のままである。一方、Next.js 16.3.0 canaryでは修正版PostCSSが使われているが、security修正だけを目的にcanaryへ移行するリスクは取らない。

PostCSS 8.5.15は同じ8系の修正版であり、一時環境でNext.jsのbuildを含む全検証が成功した。安定版Next.jsが修正版を直接利用するまでの暫定対策として、overrideが最小の変更になる。

## 検討した代替案

### `npm audit fix --force`

Next.js 9.3.3へのdowngradeを提示するため採用しない。現在のNext.js 16のAPI、React 19、App Routerとの互換性を壊す。

### Next.js 16.2.7へ更新

内部PostCSSが8.4.31のままで、警告を解消しないため採用しない。

### Next.js canaryへ更新

修正版PostCSSを含むが、未安定版の変更を本番へ入れるリスクがsecurity修正の範囲を超えるため採用しない。

### 警告だけ記録して待つ

HogeDDで脆弱な処理へ到達する可能性が低くても、互換性を確認できた修正版がある。既知の脆弱性を残す理由がないため採用しない。

## トレードオフ

- Next.jsが検証している内部PostCSSのversionを上書きする。
- 将来のNext.js更新時にもoverrideが残り、不要な固定になる可能性がある。
- dependency更新時は、overrideがまだ必要か確認する必要がある。

## テスト・検証内容

- 一時環境で`npm ci`が成功。
- Next.js内部を含むPostCSSが8.5.15へ統一された。
- `npm audit`が脆弱性0件になった。
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## 今後の見直し条件

- 安定版Next.jsがPostCSS 8.5.10以上を直接利用したとき。
- Next.js更新時にoverrideとの互換性問題が発生したとき。
- PostCSS 8.5.15以降へ新しいsecurity advisoryが出たとき。

安定版Next.jsの内部依存が修正されたら、overrideを削除し、auditと全検証を再実行する。
