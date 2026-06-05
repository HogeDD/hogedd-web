# GitHub Repository Settings Guide

共同開発を始める前に、GitHub repository 側で確認・設定する項目をまとめる。無料で使える範囲を基本にし、複雑すぎる運用は避ける。

## 前提

- repository: `iwasawarenji954/hogedd-web`
- 長期ブランチ: `main`, `dev`
- 通常の PR target: `dev`
- release / production target: `main`
- 開発は Issue 起点で進める。

## まず設定する項目

### Collaborators

共同開発者を repository collaborator として招待する。

推奨:

- 非エンジニア共同開発者: `Write`
- 管理者: `Admin`
- 外部に review だけ頼む人: 必要になってから追加

理由:

- Issue、PR、branch 作成ができるようにする。
- ただし repository 設定を壊さないよう、Admin は最小限にする。

### Pull Requests

Repository settings の Pull Requests で、以下を確認する。

推奨:

- `Allow squash merging`: on
- `Allow merge commits`: off
- `Allow rebase merging`: off
- `Automatically delete head branches`: on
- `Allow auto-merge`: 必要になってから on
- `Always suggest updating pull request branches`: on

理由:

- 履歴を読みやすくするため、merge 方法は squash に寄せる。
- PR merge 後の branch 削除を忘れにくくする。

### Branch Protection

`dev` に branch protection rule を設定する。

推奨:

- 対象 branch: `dev`
- `Require a pull request before merging`: on
- `Require status checks to pass before merging`: on
- required checks:
  - `Web`
- `Require branches to be up to date before merging`: 最初は off
- `Require approvals`: 最初は off でもよい
- `Restrict who can push to matching branches`: 必要になってから on

理由:

- `dev` は共同開発の入口なので、PR と CI を必須にする。
- 最初から approval 必須にすると速度が落ちる可能性があるため、運用に慣れてから強化する。

`main` にも branch protection rule を設定する。

推奨:

- 対象 branch: `main`
- `Require a pull request before merging`: on
- `Require status checks to pass before merging`: on
- required checks:
  - `Web`
- `Require approvals`: on
- `Restrict who can push to matching branches`: 必要になってから on

理由:

- `main` は release 可能な状態を保つ。
- `main` への merge は `dev` より慎重に扱う。

### Actions

Repository settings の Actions で、以下を確認する。

推奨:

- GitHub Actions: enabled
- Workflow permissions: `Read repository contents and packages permissions`
- `Allow GitHub Actions to create and approve pull requests`: off

理由:

- CI は PR の品質ゲートとして使う。
- Actions に強い書き込み権限は最初から渡さない。

### Secrets

Secrets and variables は repository に実値を置き、コードには入れない。

推奨:

- `.env`, `.env.local`, `.env.*.local` は commit しない。
- 必要な key 名だけ `.env.example` に書く。
- 本番・外部 API・DB 接続文字列は GitHub Secrets へ置く。
- secret の値は Issue、PR、コメント、スクリーンショットに貼らない。

今後入りそうな secret:

- Neon / PostgreSQL connection string
- YouTube API key
- deploy provider token
- ngrok authtoken

### Repository Metadata

必要に応じて repository の About を設定する。

推奨:

- Description: `Hoge Driven Development のアプリ集約サイト`
- Website: `https://www.hogedd.com/`
- Topics:
  - `nextjs`
  - `typescript`
  - `clean-architecture`
  - `hogedd`

## 今は保留する項目

### Review 必須化

最初は必須にしすぎない。共同開発に慣れてから、必要なら `dev` でも approval 必須にする。

保留理由:

- 開発速度を落としすぎないため。
- 非エンジニア参加者が PR 作成に慣れるまでは、CI と会話レビューを優先する。

### Repository Rulesets

branch protection で足りなくなったら検討する。

保留理由:

- 最初から rulesets まで使うと、設定の理解コストが上がる。

### Environments

deploy が始まったら `preview`、`production` などを検討する。

保留理由:

- 現時点では deploy 運用がまだ固まっていない。

## 非エンジニア共同開発者向けの最小ルール

- 作りたいこと、困ったことは Issue に書く。
- Issue は完璧でなくてよい。
- Issue には「背景」「やること」「やらないこと」「完了条件」を書く。
- branch は Issue 番号を入れて作る。
- PR は Issue と 1 対 1 にする。
- secret や token は絶対に貼らない。
- 分からないときは、Issue に「ここが分からない」と書く。

## 手作業設定チェックリスト

- [ ] 共同開発者を collaborator に招待する。
- [ ] Pull Requests で squash merge を有効にする。
- [ ] Pull Requests で merge commit / rebase merge を無効にする。
- [ ] Pull Requests で head branch 自動削除を有効にする。
- [ ] `dev` に branch protection を設定する。
- [ ] `dev` で `Web` check を必須にする。
- [ ] `main` に branch protection を設定する。
- [ ] `main` で approval と `Web` check を必須にする。
- [ ] Actions の workflow permissions を確認する。
- [ ] 必要な secrets を GitHub Secrets に入れる。
- [ ] repository description / website / topics を設定する。

## 見直し条件

- 共同開発者が増えたとき。
- production deploy を始めるとき。
- secret を使う外部サービスが増えたとき。
- PR の merge 事故や CI すり抜けが起きたとき。
