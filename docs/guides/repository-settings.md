# GitHub Repository Settings Guide

共同開発を始める前に、GitHub repository 側で確認・設定する項目をまとめる。無料で使える範囲を基本にし、複雑すぎる運用は避ける。

## 前提

- organization: `HogeDD`
- repository: `HogeDD/hogedd-web`
- 長期ブランチ: `main`, `dev`
- 通常の PR target: `dev`
- release / production target: `main`
- 開発は Issue 起点で進める。

## まず設定する項目

### Collaborators

共同開発者をOrganization memberとして招待し、repository roleを付与する。

現在の設定:

- 非エンジニア共同開発者: Organization member + repository `Write`
- 管理者: Organization owner + repository `Admin`
- 外部に review だけ頼む人: 必要になってから追加

理由:

- Issue、PR、branch 作成ができるようにする。
- ただし repository 設定を壊さないよう、Admin は最小限にする。

### Pull Requests

Repository settings の Pull Requests で、以下を確認する。

推奨:

- `Allow squash merging`: on
- `Allow merge commits`: on
- `Allow rebase merging`: off
- `Automatically delete head branches`: on
- `Allow auto-merge`: 必要になってから on
- `Always suggest updating pull request branches`: on

使い分け:

- 作業branchから`dev`への開発PRはsquash mergeする。
- `dev`から`main`へのrelease PRはmerge commitを使い、branch間の親子関係を維持する。
- PR merge 後の branch 削除を忘れにくくする。

### Branch Ruleset

2026年6月6日に、repository ruleset `protect-main-dev`を有効化した。

対象:

- default branchの`main`
- `dev`

現在のrule:

- branchの削除を禁止する。
- force pushを禁止する。
- pull request経由の変更を必須にする。
- merge方法はsquashとmerge commitを許可する。
- GitHub Actionsの`Web` check成功を必須にする。
- branchを最新状態へ更新することは必須にしない。
- approvalは0人とし、少人数開発の速度を落とさない。
- bypass actorを設定せず、管理者もruleを迂回しない。

```text
Issue
  ↓
作業branch
  ↓
PR + Web CI
  ↓
開発PR: squash merge
release PR: merge commit
```

`main`はVercelのProduction Branchである。`dev`から`main`へのrelease PRがmergeされた場合だけ、本番へ自動deployされる。

GitHubの設定上は両方のmerge方法を選べるため、PRの向き先を見て使い分ける。`dev`向けPRでmerge commitを使わず、`main`向けrelease PRでsquash mergeを使わない。

approvalを必須にしていない理由:

- 現在は少人数で、自己approvalできない状況を避ける。
- CIとPR差分の確認を先に機械的な必須条件にする。
- 共同開発者が増えたら、1人approvalまたはCODEOWNERSを再検討する。

`main`へのmerge権限:

- Organization memberへrepositoryの`Write`以上を付与すると、ruleを満たしたPRをmergeできる可能性がある。
- member追加時はOrganization roleとrepository roleの両方を確認する。
- approval必須化やCODEOWNERSは共同開発者が増えたときに見直す。

#### GitHub画面で確認する

1. repositoryの`Settings`を開く。
2. 左menuの`Rules`を開く。
3. `Rulesets`または`Rules`から`protect-main-dev`を開く。
4. Enforcement statusが`Active`であることを確認する。
5. Target branchesにdefault branchと`dev`が含まれることを確認する。
6. Pull request、required status checks、deletion、non-fast-forwardのruleを確認する。

rulesetを変更した場合は、設定理由をIssueとdecision logへ残す。

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

現在はapprovalを必須にしない。共同開発に慣れてから、必要なら`main`または`dev`で必須にする。

保留理由:

- 開発速度を落としすぎないため。
- 非エンジニア参加者が PR 作成に慣れるまでは、CI と会話レビューを優先する。

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

- [ ] 共同開発者をOrganization memberとして招待し、repository roleを付与する。
- [x] Pull Requests で squash merge を有効にする。
- [x] Pull Requests で merge commit / rebase merge を無効にする。
- [x] Pull Requests で head branch 自動削除を有効にする。
- [x] `dev`をrulesetで保護する。
- [x] `dev`で`Web` checkを必須にする。
- [x] `main`をrulesetで保護する。
- [x] `main`で`Web` checkを必須にする。
- [x] force pushとbranch deletionを禁止する。
- [ ] Actions の workflow permissions を確認する。
- [ ] 必要な secrets を GitHub Secrets に入れる。
- [ ] repository description / website / topics を設定する。

## 見直し条件

- 共同開発者が増えたとき。
- Write権限のcollaboratorを追加するとき。
- production deploy を始めるとき。
- secret を使う外部サービスが増えたとき。
- PR の merge 事故や CI すり抜けが起きたとき。
