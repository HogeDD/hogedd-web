# 0011: ホーム UI を HogeDD の入口として整理する

## 背景

HogeDD のトップページは、アプリ紹介や YouTube からの導線を受ける入口として育てる予定がある。一方で、既存 UI は文字量、余白、カードとボタンの見分け、ヘッダーとフッターの再利用性に課題があり、コンテンツ集約サイトとしての印象も弱かった。

## 決定したこと

- ホームを「Hoge Driven Development」と「きっかけは、なんでもいい。」を中心にした構成へ寄せる。
- Header と Footer を `SiteHeader` / `SiteFooter` として共通化する。
- ホームの Apps 表示は Carousel にし、shadcn/ui の Carousel 構成に寄せて Embla を使う。
- カルーセルカードはサムネイル、タイトル、主要導線に絞る。
- `/apps` ページも同じ Header / Footer を使い、一覧ページとしての見た目を整える。

## 理由

トップページは説明を読ませる場所というより、HogeDD の印象とアプリへの導線を一瞬で伝える場所にしたい。そのため、余白を増やし、見出しの強弱をはっきりさせ、カードの情報量を減らした。

Header / Footer は今後のページでも繰り返し使う可能性が高い。ページごとに手書きすると見た目と挙動がずれやすいため、早い段階で小さく共通化した。

Carousel は手製実装でも動くが、スワイプ、ループ、アクセシビリティ、キーボード操作を安定して扱うには専用ライブラリに寄せた方がよい。shadcn/ui の Carousel は Embla を前提にした薄いコンポーネント構成なので、既存 Tailwind UI にも合わせやすい。

## 検討した代替案

- 手製 Carousel を維持する案
  - 依存は増えないが、スマホ操作やループ表示の安定性を自前で持つ必要がある。
- Apps を通常のカードグリッドで表示する案
  - 実装は単純だが、トップページの「作品が流れていく」印象が弱い。
- shadcn CLI を導入する案
  - 一括導入は便利だが、現時点では必要な Carousel だけで十分だった。

## トレードオフ

- `embla-carousel-react` の依存が増える。
- 共通コンポーネント化により props は増えるが、Header / Footer の見た目と挙動は揃えやすくなる。
- トップページの見た目が大きく変わるため、細かな文言やカード情報量は今後も調整が必要。

## テスト・検証内容

- `npm --prefix frontend run format:check`
- `npm --prefix frontend run lint`
- `npm --prefix frontend run typecheck`
- `npm --prefix frontend run build`
- `localhost:3100` でトップページを開き、Carousel の前後ボタンが表示されクリックできることを確認した。

## 今後の見直し条件

- Apps の数が増え、トップページの Carousel だけでは探しづらくなったとき。
- YouTube API や DB 連携を導入し、カードのデータ取得経路が変わるとき。
- Header / Footer の利用ページが増え、現在の props では表現が窮屈になったとき。
