# ララ打をニシ打へ変更する

## 背景

`lala-typing`はタイピングゲームの参照実装として先に作られていたが、公開する企画名と制作経緯は「ニシ打」で確定した。route、画面文言、Aboutの制作経緯、開発DDが仮名称のままだった。

## 決定したこと

- app slugを`lala-typing`から`nishida`へ変更する。
- アプリ名を`ララ打`から`ニシ打`へ変更する。
- スタート画面の見出しを`ニシ打`にする。
- themeを`sunset`から`coral`へ変更し、同時に調整された明るいcoralのaccent色を採用する。
- Aboutの開発DDを`推しDD`から`コメントDD`へ変更する。
- Issue #87に書かれた本人の言葉をAboutへ掲載する。
- Issue #87に書かれた参考YouTube動画をAboutの参考リンクへ掲載する。
- タイピングエンジン、スコア、問題データは変更しない。
- 単純なアプリの参照実装pathを`nishida`へ更新する。

## 理由

実際の企画名とroute、metadata、サイト内ナビを一致させ、仮名称を公開準備へ持ち越さないためである。

ゲームロジックは既に動作しており、Issueの範囲はdirectory名と文言の変更である。問題データやルールまで同時に変更すると確認範囲が広がるため、今回は既存仕様を維持する。

## 検討した代替案

### routeを`lala-typing`のまま表示名だけ変える

内部pathへ仮名称が残り、metadataや参照実装の説明と企画名が食い違うため採用しない。

### `nishida`を別アプリとして複製する

同じタイピング実装が二重に残り、app registryとテストの保守対象が増えるため採用しない。

### 問題データも同時に変更する

Issueに具体的な問題文がなく、本人の言葉をAIが推測して追加することになるため採用しない。

## トレードオフ

- `/apps/lala-typing`は存在しなくなり、`/apps/nishida`へ移る。
- 過去の仮routeを共有していた場合はリンク切れになるが、未公開アプリのためredirectは追加しない。
- 問題データは既存のラランド関連語彙のままなので、コメント内容の追加はIssue #126で扱う。
- 明るいcoralは現在の一律`4.5:1`検査を満たさない。contrast tokenと用途別基準の見直しはIssue #127で扱う。

## テスト・検証内容

- `nishida`がapp registryへ登録され、`lala-typing`が残らないことをunit testで確認する。
- app page structure testでApp / About / Guideのroute、metadata、shell構成を確認する。
- タイピングエンジン、スコア、問題データの既存unit testを新pathで実行する。
- coral themeのcontrast testを実行する。
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## 今後の見直し条件

- ニシ打用の問題文を確定するとき。
- Issue #127で明るいtheme向けのcontrast設計を確定するとき。
- 公開準備でYouTube URL、OG画像、公開情報を追加するとき。
- 旧routeへのredirectが必要な利用実績を確認したとき。
