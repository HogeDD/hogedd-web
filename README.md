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
- `docs/pr/`
