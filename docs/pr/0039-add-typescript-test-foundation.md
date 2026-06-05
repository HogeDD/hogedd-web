# TypeScriptのテスト基盤を追加

## 背景

Go機能をTypeScriptへ移植する前に、既存仕様と移植後の挙動を同じ方法で検証できるunit test基盤が必要になった。

非エンジニアとAIエージェントが共同開発しても、clone後に標準コマンドだけで同じテスト結果を得られることを優先する。

## 決定したこと

- unit test runnerにVitestを採用する。
- CIと通常確認では`npm test`から`vitest run`を実行する。
- ローカルの継続実行は`npm run test:watch`へ分ける。
- unit testは`test/unit/**/*.test.ts`へ置く。
- 初期設定はNode環境とし、React component test用のjsdomやTesting Libraryはまだ追加しない。
- tsconfig path aliasはViteの標準`resolve.tsconfigPaths`で解決し、追加pluginを使わない。
- 最小実証として、既存のちんちんゲームの純粋関数をテストする。

## 理由

Next.js 16.2.6のローカルdocsで、Vitestはunit testの公式選択肢として案内されている。

VitestはTypeScriptを自然に扱え、watch modeと一回実行を分けやすい。Jestより初期設定が小さく、今後移植するdomain/usecaseの純粋関数を高速に検証できる。

`npm test`をwatch modeにしないことで、ローカル、CI、AIエージェントの全てが終了条件の明確な同じコマンドを使える。

## 検討した代替案

### Node.js標準test runner

追加依存を減らせるが、TypeScriptとtsconfig path aliasを安定して扱うための補助設定が必要になる。Next.js公式ガイドとの揃えやすさを優先して採用しない。

### Jest

Next.jsの公式選択肢であり実績も多いが、今回の純粋関数testには設定が重い。必要になった場合に見直す。

### React Testing Libraryも同時に追加する

component testには有効だが、現時点の目的はdomain/usecaseの移植準備である。必要になるまで依存を追加しない。

## トレードオフ

- async Server ComponentsはVitestだけでは十分に検証できない。
- component testを始める場合はjsdomとTesting Libraryの追加が必要になる。
- E2E testは別の基盤が必要になる。

## テスト・検証内容

- `npm ci`
- `npm test`
- `npm run test:watch`が起動できること
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- CIのWeb jobで`npm test`を実行

## 今後の見直し条件

- React component testが必要になったとき
- async Server Componentを自動検証するとき
- E2E testを導入するとき
- DB integration testを導入するとき
