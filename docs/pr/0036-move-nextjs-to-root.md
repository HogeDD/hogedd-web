# Next.jsプロジェクトをリポジトリ直下へ移動

## 背景

HogeDD本体をTypeScriptとNext.jsへ統一する方針を決めたため、`frontend/`という名前が実態と合わなくなった。

`frontend/`を作業ディレクトリとして残すと、ローカル開発、CI、Vercel設定、ドキュメントの全てで追加のパス指定が必要になる。非エンジニアとAIエージェントが同じ手順を再現できるよう、npmコマンドの実行場所をrepository rootへ統一する。

## 決定したこと

- Next.jsプロジェクトをrepository rootへ移動する。
- `app/`、`public/`、`package.json`、lockfile、設定ファイルをrootへ置く。
- `src/`は追加しない。
- Web CIもrepository rootで実行する。
- 既存Go APIはTypeScript移植完了まで`backend/`に残す。
- Go APIの起動は一時的に`npm run dev:api`から行える状態を維持する。
- UIコードの内容は変更しない。

## 理由

repository clone後に次の標準的な手順だけで起動・検証できる状態を作るため。

```bash
npm ci
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Vercelもrepository rootをそのままNext.jsプロジェクトとして認識できるため、Root Directoryの追加設定を減らせる。

## 検討した代替案

### `frontend/`を残す

移動差分は発生しないが、TypeScript一本化後も不要な階層と設定が残る。長期的な分かりやすさを優先して採用しない。

### `src/`も同時に導入する

設定とアプリコードを分離できるが、今回の目的に不要な移動が増える。必要性が生じるまで導入しない。

### Go機能の移植と同じPRで行う

ディレクトリ移動と機能変更が混ざり、問題発生時の原因特定が難しくなる。機械的な移動だけを先に行う。

## トレードオフ

- 大量のrenameが発生するため、GitHub上の差分が大きく見える。
- 移行期間中はNext.jsがroot、Go APIが`backend/`という一時的な構成になる。
- 既存のローカル作業者は、`frontend/`ではなくrootでnpmコマンドを実行する必要がある。

## テスト・検証内容

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Go APIのformat、vet、test
- `3100`番で主要ページを表示確認
- CIとローカルで同じコマンドを使うことを確認

## 今後の見直し条件

- Go APIのTypeScript移植が完了し、`backend/`を削除するとき
- TypeScriptテスト環境を導入するとき
- Vercelへ試験デプロイするとき
- `src/`導入の利点が移動コストを上回ったとき
