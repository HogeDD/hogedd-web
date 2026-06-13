# hogedd-web

HogeDDは、思いついたアプリを小さく作って公開するNext.jsプロジェクトです。

## アプリ開発前の必須事項

初めて作業する人も、AIエージェントも、最初に次を確認してください。

1. 作業はIssueから始める。
2. `dev`からIssue番号入りの作業branchを作る。
3. 新しいアプリは、MVP、改善、公開準備を別Issueに分ける。
4. 変更はIssueの範囲に絞り、基本はテストを先に書く。
5. PRは`dev`へ向け、CI成功後にsquash mergeする。
6. secret、token、password、DB URLをコード、Issue、PR、チャットへ載せない。

新しいアプリを作る前に、必ず次を読んでください。

- 開発サイクル: [`docs/guides/app-development-cycle.md`](docs/guides/app-development-cycle.md)
- 共同開発の流れ: [`docs/guides/onboarding.md`](docs/guides/onboarding.md)
- AIエージェントを含む全体ルール: [`AGENTS.md`](AGENTS.md)

## 初回セットアップ

GitやNode.jsが入っていない状態からのWindows・macOS別手順は、[`docs/guides/local-dev.md`](docs/guides/local-dev.md)にまとめています。

セットアップ済みの場合は、repository rootで次を実行します。

```bash
npm install
npm run dev
```

通常は http://localhost:3000 で確認します。

## 現在の構成

Next.jsプロジェクトはrepository直下にあります。実行中の機能はTypeScriptで動き、開発、検証、buildはNode.jsとnpmだけで完結します。

```text
app/                        # Next.js App Router
public/                     # 静的ファイル
docs/                       # ガイド、ADR、decision log
test/                       # TypeScriptテスト
```

設計方針:

- [`docs/adr/0001-nextjs-modular-monolith.md`](docs/adr/0001-nextjs-modular-monolith.md)
- [`docs/guides/architecture-guide.md`](docs/guides/architecture-guide.md)
- [`AGENTS.md`](AGENTS.md)

## 検証

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

## Docs

- [`docs/guides/local-dev.md`](docs/guides/local-dev.md)
- [`docs/guides/onboarding.md`](docs/guides/onboarding.md)
- [`docs/guides/app-development-cycle.md`](docs/guides/app-development-cycle.md)
- [`docs/guides/deployment.md`](docs/guides/deployment.md)
- [`docs/guides/architecture-guide.md`](docs/guides/architecture-guide.md)
- [`docs/guides/glossary.md`](docs/guides/glossary.md)
- [`docs/guides/brand-copy.md`](docs/guides/brand-copy.md)
- [`docs/guides/assets.md`](docs/guides/assets.md)
- [`docs/guides/repository-settings.md`](docs/guides/repository-settings.md)
- [`docs/adr/`](docs/adr/)
- [`docs/pr/`](docs/pr/)

`main`へのmerge / pushは`iwasawarenji954`が行います。
