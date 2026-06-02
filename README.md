# hogedd-clean

Next.js frontend and Go API for practicing Clean Architecture in a small monorepo.

## Layout

```text
frontend/     # Next.js app and BFF
backend/apps/clean-tasks/  # Go API
docs/         # Guides and decision logs
```

## Local Development

Start the Go API:

```bash
cd frontend
npm run dev:api
```

Start the Next.js app:

```bash
cd frontend
npm run dev:web
```

Open http://localhost:3000. If the port is already in use, Next.js may choose another available port.

## Validation

```bash
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm run build
```

```bash
cd backend/apps/clean-tasks
test -z "$(gofmt -l .)"
go vet ./...
go test ./...
```

## Docs

- `docs/guides/local-dev.md`
- `docs/guides/clean-architecture-operations.md`
- `docs/guides/glossary.md`
- `docs/guides/onboarding.md`
- `docs/guides/repository-settings.md`
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
