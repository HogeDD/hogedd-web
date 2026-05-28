# hogedd-clean

Next.js frontend and Go API for practicing Clean Architecture in a small monorepo.

## Local Development

Start the Go API:

```bash
npm run dev:api
```

Start the Next.js app:

```bash
npm run dev:web
```

Open http://localhost:3000. If the port is already in use, Next.js may choose another available port.

## Validation

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

```bash
cd apps/api
test -z "$(gofmt -l .)"
go vet ./...
go test ./...
```

## Docs

- `docs/guides/local-dev.md`
- `docs/guides/clean-architecture-operations.md`
- `docs/guides/glossary.md`
- `docs/pr/`
