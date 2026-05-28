# API

Go で書いた最小の Clean Architecture API。

## 起動

```bash
go run ./cmd/server
```

デフォルトでは `:8080` で起動する。port を変える場合は `PORT` を指定する。

```bash
PORT=8081 go run ./cmd/server
```

## 動作確認

```bash
curl http://localhost:8080/healthz
```

```bash
curl -X POST http://localhost:8080/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn clean architecture"}'
```

```bash
curl http://localhost:8080/tasks
```

## 検証

```bash
test -z "$(gofmt -l .)"
go vet ./...
go test ./...
```

## 読む順番

```text
internal/domain/task
internal/usecase/task
internal/interface/http
internal/infrastructure/memory
internal/infrastructure/system
cmd/server
test/usecase/task
test/interface/http
```
