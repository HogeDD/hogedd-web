# mainへのrelease手順を修正する

## 背景

初回の`dev`から`main`へのrelease PRをsquash mergeしたため、`main`に`dev`のcommit履歴が引き継がれなかった。次のrelease PRでは、すでに本番へ反映済みの変更まで再び差分として現れ、conflictが発生した。

## 決定したこと

- 作業branchから`dev`への開発PRは、従来どおりsquash mergeする。
- `dev`から`main`へのrelease PRだけはmerge commitを使う。
- GitHub repositoryとrulesetでsquashとmerge commitの両方を許可する。
- `main`への直接push、`main`や`dev`のrebase、rulesetの一時解除は行わない。
- 既に発生した履歴の分断は、`main`起点の`release/*` branchで`dev`を親に持つmerge commitを作って復旧する。
- 管理者向けのGitHub GUI操作とconflict時の停止条件をdeployment guideへ記載する。

## 理由

開発PRでは複数の細かいcommitを一つにまとめた方が`dev`の履歴を読みやすい。一方、長期branchである`dev`と`main`の間をsquashすると、Gitは同じ変更が取り込まれたことを履歴から判断できない。

releaseだけmerge commitにすることで、`dev`のcommitを`main`の祖先として残せる。次回releaseでは新しく追加されたcommitだけが差分となり、通常はconflictしない。

## 検討した代替案

### releaseのたびにmainをdevへmergeしてからsquashする

運用は可能だが、毎回`dev`へ本番用のsquash commitを逆流させる必要があり、操作とconflict解決が増えるため採用しない。

### devをmainへrebaseする

共有中の長期branchの履歴を書き換えるため採用しない。

### releaseのたびに内容だけを同期する

ファイル内容は一致するが、履歴の分断を解消できず、毎回一時branchが必要になるため恒常運用には採用しない。

## トレードオフ

- GitHub上でmerge方法を選べるため、管理者がPRの向き先に応じて正しく選ぶ必要がある。
- `main`の履歴にはrelease merge commitが追加される。
- 今回は過去のsquash releaseを復旧するため、一度だけ特別なrelease branchが必要になる。

## テスト・検証内容

- repository設定でsquashとmerge commitが有効であることを確認する。
- rulesetで両方のmerge方法が許可されていることを確認する。
- 復旧用merge commitが`main`と`dev`を親に持つことを確認する。
- 復旧branchと`dev`のファイル内容が一致することを確認する。
- release PRの`Web`とVercel checkを確認する。

## 今後の見直し条件

- 長期branch構成を変更するとき。
- GitHub Flowへ移行するとき。
- release automationを導入するとき。
- merge方法の選択ミスが再発したとき。
