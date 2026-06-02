# 0016: 非エンジニア向けオンボーディングを追加する

## 背景

HogeDD に非エンジニアの共同開発者が参加する予定がある。GitHub や Git に慣れていない人でも、Issue から PR まで迷いにくいように、最初に読む開発手順を用意する必要がある。

## 決定したこと

- README に開発の基本ルールを短く追加する。
- 詳しい手順は `docs/guides/onboarding.md` に分ける。
- GitHub GUI 操作でも読めるように、Issue、branch、PR、CI、squash merge、branch 削除の流れを書く。
- AI 駆動で開発する場合も、同じ Issue / Branch / PR の流れを守ることを書く。
- `main` への merge / push は `iwasawarenji954` が行うことを明記する。

## 理由

README は最初に見る場所なので、開発ルールの最短版を置く。一方で、初心者向けの文章を README に全部入れると長くなりすぎるため、詳細は guide に分けた。

非エンジニアが参加する場合、コマンドだけではなく GitHub の画面操作も必要になる。完全な Git 入門にはしないが、HogeDD で迷わないための流れは明記する。

## 検討した代替案

- README だけに全部書く案
  - 最初に見つけやすいが、README が長くなりすぎる。
- docs だけに書く案
  - 詳細は書きやすいが、初参加者が見つけにくい。
- Git / GitHub の完全な入門を書く案
  - 丁寧だが、この project の運用ルールから外れて重くなりすぎる。

## トレードオフ

- GitHub GUI の表記は将来変わる可能性がある。
- ただし、画面の細かい説明よりも、守るべき流れを固定することを優先した。
- README と docs の二重管理になるが、README は短い要約、docs は詳細という役割で分ける。

## テスト・検証内容

- `npm --prefix frontend run format:check`

## 今後の見直し条件

- 共同開発者が実際に参加して、手順で迷う箇所が分かったとき。
- GitHub の UI が変わり、画面操作の説明が古くなったとき。
- repository settings や branch protection の運用が変わったとき。
