# Next.js 中心の設計方針と開発ガイドを再整備

## 背景

HogeDD 本体を TypeScript へ統一する方針を決めたため、Go API を中心に書かれている `AGENTS.md` と開発ガイドをそのまま使えなくなった。

今後は非エンジニアも AI エージェントと共同開発する。抽象的な設計用語だけでなく、どこへ何を書くか、いつ層を追加するかを判断できるルールが必要である。

## 決定したこと

- Next.js App Router を設計の土台にする。
- アプリ固有コードは `app/apps/<app-name>/` に閉じる。
- 単純な機能には Clean Architecture の層を強制しない。
- DB、重要な業務ルール、外部 API、transaction がある機能だけ依存境界を追加する。
- TypeScript 移行後は `frontend/` と `backend/` を廃止し、Next.js プロジェクトをリポジトリ直下へ置く。
- `src/` は追加しない。
- Vercel は実行環境として使い、Vercel 固有バックエンドサービスには依存しない。

## 理由

Next.js の Server Components、Server Actions、Route Handlers、private folders を自然に使う方が、内部 HTTP 通信や不要な adapter を減らせる。

一方で、全処理を page や action に直接書くと、重要なルールと DB 実装が混ざる。複雑さが存在する機能だけ Clean Architecture の依存ルールを使うことで、開発速度と変更耐性を両立する。

## 検討した代替案

- Go API を維持する
- 全機能へ同じ Clean Architecture の層を強制する
- Next.js のファイルだけで全処理を完結させる
- 移行時に `src/` 構成も導入する

詳細は `docs/adr/0001-nextjs-modular-monolith.md` に記録する。

## トレードオフ

- 機能の複雑さを判断する必要がある。
- 単純な機能と複雑な機能でディレクトリ数が異なる。
- ガイドが実装とずれないよう、構成変更時に更新する必要がある。

## テスト・検証内容

- Next.js 16.2.6 のローカル docs で project structure、Server Components、data fetching、mutating data、Route Handlers を確認した。
- `AGENTS.md`、README、開発ガイド間のパスと方針を確認する。
- formatter、lint、typecheck を実行する。

## 今後の見直し条件

- TypeScript 完全移行が完了したとき
- PostgreSQL を導入するとき
- 認証を導入するとき
- 外部クライアント向け API を公開するとき
- 独立サービスが必要になったとき
