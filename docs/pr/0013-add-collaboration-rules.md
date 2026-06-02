# 0013: Issue 起点の共同開発ルールを追加する

## 背景

HogeDD に非エンジニアの共同開発者が参加する予定がある。今後は人間とエージェントが同じ前提で動けるように、Issue、Branch、PR の関係と粒度を明確にしておきたい。

## 決定したこと

- 開発は Issue 起点にする。
- Issue、Branch、PR は原則 1 対 1 対応にする。
- ブランチ名は `feature/`、`fix/`、`docs/`、`infra/` の作業種別 prefix を使う。
- `codex/` prefix はこのプロジェクトの運用では使わない。
- 新しいアプリは、開発段階では「動くところまで」を 1 Issue にしてよい。
- 修正 Issue は小さくし、1 Issue で 1 つの問題や改善に寄せる。
- Issue には最低限、背景、やること、やらないこと、完了条件を書く。
- GitHub repository settings の手作業チェックリストを `docs/guides/repository-settings.md` に追加する。

## 理由

共同開発では、作業の入口が曖昧だと、何をすればよいか、どこまでやれば終わりかが分かりにくくなる。特に非エンジニアが参加する場合、細かすぎるルールよりも、迷わず書けて壊れにくいルールが必要になる。

一方で、新しいアプリ開発は細かく分割しすぎると勢いが落ちる。HogeDD では、まず動くものを荒く作り切ることも大事なので、新規アプリは大きめ Issue を許可し、修正や改善は小さく刻む方針にした。

GitHub の設定は画面操作や権限によってエージェントが直接変更できない場合がある。そのため、最悪手作業でも設定できるように、branch protection、merge 方法、Actions 権限、Secrets、collaborator 権限を guide として残す。

## 検討した代替案

- すべて `codex/` prefix にする案
  - エージェント作業者の識別には便利だが、プロジェクトの作業種別が分かりにくい。
- すべて `feature/` prefix にする案
  - 単純だが、修正、docs、infra の違いが branch 名から見えにくい。
- Issue を細かく分ける案
  - 修正には向いているが、新規アプリ開発では勢いを削ぐ可能性がある。
- GitHub 設定を口頭運用にする案
  - すぐ始められるが、共同開発者が増えたときに設定漏れや判断の揺れが起きやすい。

## トレードオフ

- 新規アプリの Issue は大きくなる可能性がある。
- その代わり、動くところまで一気に作る勢いを維持できる。
- 作業種別 prefix を使うため、branch 名の判断は少し増える。
- ただし、`feature`、`fix`、`docs`、`infra` の 4 種類に絞ることで迷いすぎないようにする。
- repository settings guide は実設定そのものではないため、最終的な GitHub 画面での確認は必要になる。

## テスト・検証内容

- `npm --prefix frontend run format:check`

## 今後の見直し条件

- 共同開発者が Issue を書くときに迷う場面が増えたとき。
- Issue と PR の 1 対 1 対応が運用上つらくなったとき。
- GitHub の repository settings や branch protection を整備するとき。
