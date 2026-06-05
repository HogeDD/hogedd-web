# HogeDD 共同開発オンボーディング

HogeDD に参加するときの最初の手順です。GitHub や Git に慣れていなくても、まずはこの流れだけ守れば大丈夫です。

## 大事な考え方

- 作業は必ず Issue から始めます。
- 1 つの Issue に対して、1 つの branch と 1 つの PR を作ります。
- 作業 branch は `dev` から作ります。
- PR は `dev` に向けます。
- CI が通ったら `dev` に squash merge します。
- `main` への merge / push は `iwasawarenji954` が行います。
- password、API key、token、DB URL などの secret は絶対に書き込まないでください。

## 開発手順

### 1. Issue を作る

GitHub の repository で `Issues` を開き、`New issue` を押します。

Issue には、最低限これを書きます。

```md
## 背景

なぜやりたいのか。困っていること、作りたいもの、思いついた理由。

## やること

- 今回やること

## やらないこと

- 今回は触らないこと

## 完了条件

- 何ができたら終わりか
```

完璧に書けなくても大丈夫です。分からないところは「ここが分からない」と書いてください。

Issue title の例:

```text
[app] タイピング練習アプリを動くところまで作る
[ui] ホームの About 文言を整理する
[fix] スマホでカードのボタンが押しづらい問題を直す
[docs] README に開発手順を書く
[infra] Web CI に typecheck を追加する
```

### 2. Issue から branch を切る

branch は `dev` から作ります。

branch 名には Issue 番号を入れます。

```text
feature/21-new-mini-app
fix/22-mobile-card-tap
docs/16-onboarding-guide
infra/23-web-ci-typecheck
```

どれを使えばよいか迷ったら、次を目安にします。

- 新しいアプリや新機能: `feature/`
- 不具合修正: `fix/`
- README や docs: `docs/`
- CI、環境変数、GitHub 設定: `infra/`

#### GitHub の画面で branch を作る場合

1. Issue を開く
2. 右側の `Development` を見る
3. `Create a branch` があれば押す
4. base branch が `dev` になっていることを確認する
5. branch 名に Issue 番号が入っていることを確認する
6. branch を作る

GitHub の画面が変わっていて分からない場合は、Issue に「branch 作成が分からない」とコメントしてください。

#### ローカルで branch を作る場合

```bash
git switch dev
git pull --ff-only
git switch -c docs/16-onboarding-guide
```

### 3. 基本ローカルで開発する

ローカルで変更します。

Web を起動する場合:

```bash
npm run dev
```

Next.jsプロジェクトはリポジトリ直下にあります。コマンドはrepository rootで実行します。

既存の Clean Tasks で Go API を起動する必要がある場合だけ:

```bash
npm run dev:api
```

新しい機能を Go 側へ追加しません。

詳しいローカル開発手順は `docs/guides/local-dev.md` を見てください。

### 4. PR が作れる状態になったら push する

作業がある程度まとまったら、remote に push します。

```bash
git push -u origin docs/16-onboarding-guide
```

AI 駆動で開発している場合も、この段階で Issue 番号つき branch を push します。

### 5. PR を作る

GitHub の repository を開くと、push した branch から PR を作る案内が出ることがあります。`Compare & pull request` を押します。

PR の向きは必ず次にします。

```text
base: dev
compare: 作業 branch
```

PR 本文には最低限これを書きます。

```md
## 概要

- 何を変えたか

## 検証

- 実行した確認

Closes #16
```

`Closes #16` のように Issue 番号を書くと、PR が merge されたときに Issue も閉じられます。

### 6. CI を確認する

PR を作ると GitHub Actions の CI が動きます。

移行期間中は主にこの check を見ます。

- `API`
- `Web`

どちらも pass していることを確認します。fail している場合は、PR 画面で失敗内容を確認します。分からないときは PR にコメントしてください。

TypeScript 完全移行後は Go 用の `API` check を削除する予定です。

Webの変更では、`npm test`でTypeScriptのunit testも実行されます。

### 7. `dev` に squash merge する

CI が通ったら、PR を `dev` に squash merge します。

GitHub の PR 画面で:

1. `Squash and merge` を選ぶ
2. merge message を確認する
3. `Confirm squash and merge` を押す

merge 方法は基本 `Squash and merge` です。`Merge commit` や `Rebase merge` は使いません。

### 8. 用が済んだ remote branch を削除する

PR を merge したら、GitHub の画面に `Delete branch` が出ることがあります。出ていたら押します。

branch は作業が終わったら消して大丈夫です。必要な内容は `dev` に入っています。

### 9. `main` への merge は管理者が行う

`main` は公開・本番に近い branch です。

`main` への merge / push は `iwasawarenji954` が行います。共同開発者は、基本的に `dev` への PR までを担当します。

## AI 駆動で開発する場合

AI に頼む場合も、流れは同じです。

1. Issue を作る
2. Issue 番号つき branch を切る
3. AI に作業してもらう
4. PR を作る
5. CI を確認する
6. `dev` に squash merge する
7. branch を消す

AI に頼むときは、Issue の URL とやってほしいことを伝えると進めやすいです。

例:

```text
Issue #16 を進めてください。
初心者向けに README と docs を整えてください。
```

## やってはいけないこと

- secret、token、password、DB URL を Issue、PR、docs、スクリーンショットに貼らない。
- `.env.local` を commit しない。
- `main` に直接 push しない。
- Issue なしで大きな作業を始めない。
- 1 つの PR に関係ない修正を混ぜない。
- 分からないまま repository settings を変更しない。

## 困ったとき

Issue または PR に、分からないことをそのまま書いてください。

例:

```text
branch の切り方が分かりません。
CI が落ちていますが、どこを見ればいいか分かりません。
この画像を repository に入れてよいか分かりません。
```

迷ったことを残しておくと、次のルール改善にも使えます。
