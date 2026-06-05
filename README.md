# hogedd-clean

HogeDD は、思いついたアプリを小さく作って公開する Next.js プロジェクトです。

## 現在の構成

現在は TypeScript 完全移行の途中です。

```text
frontend/                   # 現在の Next.js プロジェクト
backend/apps/clean-tasks/   # TypeScript へ移植予定の Go API
docs/                       # ガイド、ADR、decision log
```

移行後は Next.js プロジェクトをリポジトリ直下へ置き、`frontend/` と `backend/` を廃止します。新しい Go 機能は追加しません。

設計方針:

- `docs/adr/0001-nextjs-modular-monolith.md`
- `docs/guides/architecture-guide.md`
- `AGENTS.md`

## ローカル開発

詳しい手順は `docs/guides/local-dev.md` を読んでください。ngrok を使って外部端末から確認する手順もここにまとめています。

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

通常は http://localhost:3000 で確認します。Codex が検証用に起動する場合は、競合を避けるため `3100` を使います。

既存の Clean Tasks で Go API が必要な場合だけ、移行完了まで以下を使います。

```bash
cd frontend
npm run dev:api
```

## 検証

```bash
npm --prefix frontend run format:check
npm --prefix frontend run lint
npm --prefix frontend run typecheck
npm --prefix frontend run build
```

既存 Go コードを変更した場合だけ、移行完了まで Go の検証も行います。

## Docs

- `docs/guides/local-dev.md`
- `docs/guides/architecture-guide.md`
- `docs/guides/glossary.md`
- `docs/guides/onboarding.md`
- `docs/guides/brand-copy.md`
- `docs/guides/repository-settings.md`
- `docs/adr/`
- `docs/pr/`

## 開発の基本ルール

HogeDD は Issue 起点で開発します。AI 駆動で開発する場合も、人間が GitHub の画面で操作する場合も、この流れを守ります。

1. Issue を作る
2. Issue を元に `dev` から branch を切る
3. 基本ローカルで開発する
4. PR が作れる状態になったら remote に push して PR を作る
5. CI が通っていたら `dev` に squash merge する
6. 用が済んだ remote branch は削除する

`main` への merge / push は `iwasawarenji954` が行います。詳しい手順は `docs/guides/onboarding.md` を読んでください。
