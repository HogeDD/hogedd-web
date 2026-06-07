# アプリページへサイト共通レイアウトを追加する

## 背景

各アプリページにはサイト共通のHeaderとFooterがなく、アプリを触った後にホームやApps一覧へ戻る導線がなかった。今後アプリを追加するたびに個別実装すると、表示や余白が揃わなくなる。

## 決定したこと

- サイト共通のHeaderとFooterを表示する`AppPageShell`をApps配下の共有コンポーネントとして追加する。
- 各アプリのroute segmentに`layout.tsx`を置き、アプリ固有ページを`AppPageShell`で囲む。
- 新しいアプリページにlayoutがない場合はunit testを失敗させる。
- 新規アプリの必須構成として`AGENTS.md`とアプリ開発サイクルへ記載する。

## 理由

Next.jsのnested layoutを使うと、アプリ固有のページや状態へ触れずに共通UIを追加できる。`app/apps/layout.tsx`へ置くとApps一覧にもHeaderとFooterが重複するため、各アプリsegmentのlayoutから共通shellを利用する。

## 検討した代替案

### 各pageへHeaderとFooterを直接追加する

変更は単純だが、今後のアプリで同じ実装が繰り返され、追加漏れを自動検出できないため採用しない。

### Apps直下のlayoutで全routeを囲む

一つのlayoutで管理できるが、すでに共通UIを持つ`/apps`一覧まで囲まれ、HeaderとFooterが二重になるため採用しない。

### route groupへ既存アプリを移動する

一つのlayoutを自動適用できるが、既存のimport pathやAPI routeを含む大きな移動が必要になる。Issueの範囲を超えるため採用しない。

## トレードオフ

- 新しいアプリごとに短い`layout.tsx`を追加する必要がある。
- 共通shellの変更はすべてのアプリページへ影響する。

## テスト・検証内容

- 各アプリページに`layout.tsx`があることをunit testで確認する。
- desktopとmobileでHeader、Footer、アプリ本体のoverflowを確認する。
- Prettier、ESLint、TypeScript、Vitest、Next.js production build。

## 今後の見直し条件

- アプリ数が増え、各segmentのlayout追加が明確な負担になったとき。
- route groupへ安全に移行できる構成へ変わったとき。
- アプリごとに異なるHeaderやFooterが必要になったとき。
