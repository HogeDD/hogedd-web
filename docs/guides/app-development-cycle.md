# アプリ開発サイクル

HogeDDで新しいアプリを思いついてから、アプリ本体とYouTube動画を本番公開するまでの進め方をまとめる。

このガイドは最初から完成形を決めるためのものではない。まず最低限動くものを作り、実物を見てから必要な改善を小さいIssueへ分ける。

## 全体の流れ

```text
相談
  ↓
MVP Issue
  ↓
devで実物を確認
  ↓
必要な改善Issue
  ↓
公開準備Issue
  ↓
YouTubeとアプリを同時に本番公開
  ↓
振り返り
```

## 1. Issueを作る前に相談する

作りたいものが曖昧な段階では、Issueを作らずに相談してよい。

最初に確認すること:

- どんな欲望や衝動から作りたいのか。
- 誰がどんな場面で触るのか。
- 最低限、何ができれば遊べるか。
- DB、外部API、認証、オンライン通信が必要か。
- 既存アプリやサイト共通UIを変更する必要があるか。

相談では実装の細部まで固定しない。最初のIssueで作る範囲と、今回は作らない範囲が説明できたらIssueへ進む。

## 2. MVP Issueで最低限動かす

最初のIssueでは、アプリを最低限動かしてPreviewで確認できるところまでを扱う。見た目の完成やYouTube公開まで一度に含めない。

Issue titleの例:

```text
[app] タイピングゲームを最低限遊べるようにする
```

Issue本文の例:

```md
## 背景

短い文章を勢いよく入力して遊べるアプリを作りたい。

## やること

- 問題文を表示する
- 入力結果を判定する
- 終了時に結果を表示する

## やらないこと

- ランキング
- 詳細な演出
- YouTube公開とApps一覧への掲載

## 完了条件

- desktopとmobileで一連の操作ができる
- 主要ルールがテストされている
- Previewで実物を確認できる
```

実装前に`AGENTS.md`の保存場所とClean Architecture導入条件を確認する。単純なアプリは`page.tsx`、`_components`、`_lib`から始め、必要性が確認できる前に層を増やさない。

MVP PRは通常どおり`dev`へ向け、CI成功後にsquash mergeする。Issueはmergeによる自動close、またはmerge確認後の手動closeで完了させる。

## 3. devで確認し、改善Issueを分ける

MVPを`dev`へmergeしたら、実物をdesktopとmobileで触る。

確認すること:

- 最初に何をすればよいか分かるか。
- 主要操作が押しやすく、結果が理解できるか。
- テキストのoverflowやUIの重なりがないか。
- 待機、空状態、失敗、再試行が必要か。
- 画像、音、motionが本当に必要か。
- アクセシビリティ上、操作できない箇所がないか。

見つかった改善は、目的ごとに小さいIssueへ分ける。一つの改善Issueへ、関係のないUI変更やサイト全体の調整を混ぜない。

Issue titleの例:

```text
[ui] タイピングゲームの結果表示を読みやすくする
[ui] タイピングゲームへ代表画像を追加する
[fix] スマホで入力欄が隠れる問題を直す
```

ホームや`/apps`の小さな調整も原則Issue化する。Issueなしで行うのは、相談、観察、次のIssue範囲を決める作業までとする。

## 4. 未公開期間は本番releaseを止める

新しいアプリのMVPが`dev`へ入った時点から、そのアプリの公開準備が完了するまで`dev → main`のrelease PRを作らない。未公開アプリ以外の変更も、この期間は本番releaseを待つ。

MVPをmergeしたら、未公開期間の目印として公開準備Issueを作る。公開準備Issueが開いている間はrelease停止中と判断する。

公開準備Issueの冒頭へ次を記載する:

```md
> このIssueが開いている間は、未公開アプリを含むため `dev → main` のreleaseを停止する。
```

releaseを止める理由:

- アプリrouteだけが動画より先に本番公開されるのを防ぐ。
- ホーム、`/apps`、YouTubeで公開状態が食い違うのを防ぐ。
- 公開日を一つのリリースとして確認できるようにする。

緊急修正など、停止中に本番反映が必要な変更が出た場合は、通常の`dev → main` releaseへ混ぜない。別Issueで影響を確認し、必要な変更だけを`main`へ届ける手順を決める。

## 5. 公開準備Issueで公開物を揃える

公開準備Issueでは、アプリの新機能を増やさず、本番公開に必要なものを揃える。

Issue titleの例:

```text
[app] タイピングゲームをYouTubeと本番へ公開する
```

やること:

- アプリ名、説明、開発DD、公開日を確定する。
- routeのmetadataを確認する。
- アプリ専用のOpen Graph画像とaltを用意する。
- YouTube動画を公開できる状態にする。
- `app/apps/_lib/app-links.ts`へ公開情報を登録する。
- 必要な場合は`app/apps/_lib/apps-page-sections.ts`のおすすめslugを変更する。
- ホームと`/apps`のカード、アプリroute、YouTubeリンクを確認する。
- desktopとmobileで主要操作とoverflowを確認する。
- 素材の保存場所、権利、形式を`docs/guides/assets.md`に照らして確認する。

完了条件の例:

```md
## 完了条件

- アプリ本体とYouTube動画を同じ本番公開で案内できる
- ホームと `/apps` から正しい動画へ移動できる
- アプリrouteのmetadataとOG画像が設定されている
- desktopとmobileで主要操作と表示を確認している
- format、lint、typecheck、test、buildが通る
```

YouTube URLが確定するまでは、公開情報を推測で登録しない。secret、限定公開URL、公開前に共有できない情報をIssueやPRへ載せない。

公開準備Issueは本番確認までrelease停止の目印として残す。公開準備PRの本文では`Closes`を使わず`Refs #<issue-number>`で関連付け、`dev`へのmerge時には閉じない。

## 6. YouTubeとアプリを同時に本番公開する

正式公開は、アプリrouteを`main`へ入れ、YouTube動画を公開し、ホームと`/apps`へ`published`として掲載する一つの作業として扱う。

公開順:

1. 公開準備PRを`dev`へ作る。
2. CIとPreviewでroute、metadata、画像、リンクを確認する。
3. PRを`dev`へsquash mergeする。
4. 公開準備Issueの完了条件を最終確認する。
5. `dev → main`のrelease PRを作る。
6. CI成功後、管理者がmerge commitでmergeする。
7. Production deploymentの成功を確認する。
8. YouTube動画を公開する。
9. Productionのアプリroute、ホーム、`/apps`、YouTubeリンクを確認する。
10. 公開準備Issueを閉じ、release停止を解除する。

YouTubeの予約公開を使う場合も、Productionでアプリを利用できる時刻と大きくずれないようにする。どちらかの公開に失敗した場合は、成功扱いにせず公開準備Issueを開いたままにする。

## 7. PRとIssueを閉じる順序

作業は必ず次の順序で進める。

```text
変更
  ↓
commit
  ↓
push
  ↓
PR作成
  ↓
CI成功
  ↓
merge
  ↓
Issue close確認
```

実装が手元で完成しただけではIssueを閉じない。PR本文の`Closes #<issue-number>`による自動closeを使う場合も、merge後にIssueが閉じたことを確認する。

公開準備Issueだけは例外として、`dev`向けPRで`Closes`を使わない。Production deploymentとYouTube公開の両方を確認してから手動で閉じる。

## 8. 公開後にサイクルを見直す

次のアプリでは、このガイドを最初から最後まで使う。各工程で迷ったことをIssueまたはPRへ残す。

特に記録すること:

- MVP Issueへ含める範囲で迷った点。
- UI、画像、動画を別Issueへ分けた基準。
- `dev`のrelease停止で困ったこと。
- 公開準備チェックで不足していた項目。
- 人とAIで認識がずれた手順。

一つのアプリを公開した後にガイドを改訂する。複数回使って手順が安定してから、Issue作成、構成判断、公開チェックを支援する「HogeDDアプリ追加Skill」を別Issueで検討する。

## 今は自動化しないこと

- アプリフォルダを作るCLI generator。
- IssueやPRの自動作成。
- metadataやApps一覧登録の自動生成。
- 公開操作の自動化。
- Codex Skill。

まず手順を実際のアプリで検証し、繰り返し発生する作業と判断を確認してから自動化する。
