# #159 PR前に最新devとの差分を確認する

## 背景

開発者やAIが複数のIssueを並行して進めると、作業branchを切った後に`dev`が進む。PR作成時点で差分やconflictを確認しないと、merge直前に衝突が発覚し、初心者がGitHub画面だけで判断して壊す危険がある。

## 決定したこと

- PR作成直前に`git fetch origin dev`を実行し、作業branchへ`origin/dev`をmergeして最新の`dev`との差分とconflictを確認する。
- conflictがない場合は、必要な検証をやり直してからpushし、`dev`向けPRを作る。
- conflictが出た場合、機械的に判断できる範囲は作業branch上で解消する。
- 人間の意思決定が必要なconflictは勝手に解消せず、draft PRまたはPRコメントで状況を残して判断を依頼する。
- conflictを減らすため、Issue粒度を小さくし、同じファイルや同じUI領域を複数人・複数AIが同時に大きく触らないようにする。

## 理由

`dev`は長期branchで、通常の作業PRは`dev`へsquash mergeする。作業branch側に`origin/dev`をmergeしても、最終的に`dev`へ入るcommitはsquashされるため、branch内のmerge commitが本線履歴を汚しにくい。

一方、作業branchをrebaseしてforce pushする運用は、Gitに慣れていない人や複数AIが同じbranchを見る場合に事故りやすい。特にユーザーの未コミット変更や他者のpushがあると、履歴の書き換えによる混乱が起きやすい。

## 検討した代替案

- PRを作ってからGitHub上でconflictを確認する案: conflictを可視化できるが、GitHub画面だけで推測して解消しやすくなるため標準にはしない。
- 作業branchを`origin/dev`へrebaseする案: 履歴は直線的になるが、force pushが必要になる場面があり、共同開発の安全性を優先して採用しない。
- conflictが出たら必ず人間へ丸投げする案: 安全ではあるが、機械的なpackage lockや単純な近接変更まで止まるため、AIが判断できる範囲は解消する。

## トレードオフ

- 作業branchにmerge commitが入ることがある。
- PR前の確認手順が1つ増える。
- conflict解消後は検証をやり直す必要がある。

## テスト・検証内容

- docsのみの変更のため、`npm run format`と`npm run format:check`でMarkdownの整形を確認する。

## 今後の見直し条件

- 作業branchのmerge commitがPRレビュー上のノイズになる場合は、AIだけに限定したrebase手順やGitHub CLIによる安全な更新手順を再検討する。
- 同じ領域のconflictが繰り返し起きる場合は、アーキテクチャ、Issue分割、担当範囲の決め方を見直す。
