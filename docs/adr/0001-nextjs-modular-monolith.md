# ADR 0001: Next.js 中心のモジュラーモノリスを採用する

- Status: Accepted
- Date: 2026-06-06
- Issue: #35

## 背景

HogeDD は、Next.js フロントエンドと Go API を分けたモノレポとして始めた。Go とクリーンアーキテクチャを学ぶ目的には有効だったが、HogeDD 本体を育てるうえでは、言語、起動方法、CI、API 契約、デプロイ先が分かれることによる負担が大きい。

今後は非エンジニアも AI エージェントと共同開発する。高度な設計を維持することより、ルールを読めば保存場所と実装方法を判断でき、変更を小さく安全に進められることを優先する。

Next.js App Router は、Server Components、Server Actions、Route Handlers、private folders、route 単位のコロケーションを提供する。Next.js はプロジェクト構成を一つに強制しておらず、機能単位でコードを配置できる。

## 決定

HogeDD 本体は、TypeScript と Next.js App Router に統一する。

全体構成は、**Next.js 中心のモジュラーモノリス**とする。各アプリを `app/apps/<app-name>/` に閉じ、単純な機能は Next.js の標準的な構成だけで実装する。DB、重要な業務ルール、外部 API、transaction などを持つ機能だけ、Clean Architecture の依存ルールを追加する。

移行後は `frontend/` と `backend/` を廃止し、Next.js プロジェクトをリポジトリ直下へ置く。

```text
app/
  _components/             # サイト全体で共有する UI
  _lib/                    # サイト全体で共有する小さな処理
  apps/
    <app-name>/
      page.tsx
      _components/
      _lib/
      _actions/            # 必要な場合だけ
      _domain/             # 必要な場合だけ
      _usecases/           # 必要な場合だけ
      _infrastructure/     # 必要な場合だけ
      api/                 # 外部 HTTP API が必要な場合だけ
docs/
public/
test/
package.json
```

`src/` は導入しない。現在の `frontend/` をルートへ移す際の変更量を抑え、パスを短く保つためである。

## Next.js と Clean Architecture の使い分け

Next.js の規約を常に土台とする。

- 読み取りは Server Component から server-side の関数または usecase を呼ぶ。
- 画面からの更新は Server Action を基本とする。
- Route Handler は、外部クライアント、Webhook、公開 REST API が必要な場合に使う。
- Client Component は state、event handler、browser API が必要な範囲に限定する。
- アプリ固有コードは route の近くへ置く。

次のいずれかがある機能だけ、`_domain`、`_usecases`、`_infrastructure` を追加する。

- DB へ永続化する
- 複数画面から使う重要な業務ルールがある
- 外部 API を利用する
- transaction が必要
- 外部技術を交換できるようにしたい
- 単体テストで独立して守るべき判断がある

依存方向は次の通りとする。

```text
page / component / Server Action / Route Handler
                         ↓
                      usecase
                         ↓
                       domain

infrastructure → usecase が必要とする port を実装
```

`domain` と `usecase` は、Next.js、Vercel、React、DB driver、HTTP の型へ依存しない。

## Vercel との関係

Vercel はホスティングと実行環境として利用する。バックエンドの設計を Vercel 固有サービスへ依存させない。

原則として採用しないもの:

- Vercel Blob
- Vercel KV
- Edge Config
- Vercel Queues
- Vercel Workflow
- Vercel 固有型を domain / usecase で扱うこと

外部サービスが必要になった場合は、標準的な API または交換可能な interface を介して利用する。

## 検討した代替案

### Go API を維持する

言語ごとの責務が明確で、Go とバックエンド開発を学べる。一方、HogeDD 本体では学習目的より、開発速度と運用負荷の低さを優先するため採用しない。

### 全機能へ完全な Clean Architecture を強制する

技術交換の境界は明確になるが、小さな静的アプリにも多数の層と interface が生まれる。非エンジニアと AI が保存場所を迷いやすく、変更量も増えるため採用しない。

### Next.js の page、action、DB 処理だけで全てを実装する

初期実装は速いが、重要な業務ルールが UI、HTTP、DB と混ざりやすい。複雑な機能に限って依存境界を追加する方針とする。

### `src/` 配下へ全コードを移す

Next.js が正式に対応する構成だが、現在のコードからの移動量が増える。現時点では得られる効果が小さいため採用しない。

## トレードオフ

- 機能ごとに構造が異なるため、判断ガイドを維持する必要がある。
- Clean Architecture を適用する境界は自動では決まらない。
- Route Handler を使わない内部処理は、外部クライアントから直接利用できない。
- TypeScript と Node.js が性能上の問題になった機能は、将来別サービスへ分離する可能性がある。

## 見直す条件

- 同じ domain/usecase を複数アプリで共有する必要が生じた
- 独立デプロイが必要な機能が生じた
- CPU、メモリ、同時接続数を計測し、Node.js が明確なボトルネックになった
- 外部クライアント向け API が増え、API 契約を独立管理する必要が生じた
- ルート直下の構成が大きくなり、`src/` 導入の利点が移行コストを上回った
