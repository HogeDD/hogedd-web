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

各アプリのroute segmentには`layout.tsx`を置き、`app/apps/_components/app-page-shell.tsx`の`AppPageShell`で`children`を囲む。これにより、アプリ固有のUIへサイト共通のHeaderとFooterを重複実装せず追加する。

アプリごとの雰囲気は、共通レイアウトを変えず色テーマで表現する。`app/apps/_lib/app-theme.ts`の`appThemePresets`から選び、アプリの`layout.tsx`で`AppPageShell`の`theme`へ渡す。テーマ未指定時は、緑と黄色を組み合わせた`defaultAppTheme`が使われる。

```tsx
import { appThemePresets } from "@/app/apps/_lib/app-theme";

<AppPageShell theme={appThemePresets.ocean}>{children}</AppPageShell>;
```

プリセットにない配色が必要な場合は`createAppTheme`で必要な色だけ差し替える。任意classやCSSを`AppPageShell`へ渡してレイアウト、余白、フォントをアプリごとに変更しない。明るいaccentを使う場合は、通常背景上の小さい文字を濃い`accentText`、accent背景上の文字を白い`accentForeground`として分ける。本文と通常背景上の文字は背景と`4.5:1`以上、ブランド色として使うaccent上の白文字と装飾・UI境界は`3:1`以上を確認する。

UIやthemeを決めるときは、開発環境の`/theme-preview`を人間へ案内する。全presetを同じ部品で比較できるため、名前や色値だけで決めず、実際の色面と白文字を確認して選ぶ。productionでは404になる。

### 参照実装を写してから作る

新しいアプリは、ゼロから構成を考えず、参照実装の形を写してから中身を差し替える。

単純な構成(`_components` + `_lib`)の手本は`app/apps/nishida/`(タイピングゲーム)。各ファイルが示している判断:

- `page.tsx`: Server Componentの入口。metadataを定義し、Client Componentをマウントするだけ。
- `layout.tsx`: `AppPageShell`にテーマと`availablePages`を渡す唯一の場所。
- `_components/typing-game-client.tsx`: アプリで唯一の`"use client"`。キー入力もタップも同じ状態遷移関数(`handleKey`)へ流し、遷移ロジックを描画から分離する。
- `_lib/`: 判定エンジン、スコア計算、データ(変換表・単語)。ReactやNext.jsをimportしない純関数とデータだけを置く。ロジックよりデータに寄せるほど壊れにくい(変換表が良い例)。
- `test/unit/apps/nishida/`: `_lib`の仕様を固定するテスト。実装より先に書く。データの妥当性(全単語が変換可能か)もテストで守る。
- ユーザーが編集する文章・データは`// ↓ ここを編集する`で囲んだ`const`にまとめる。

DBや外部APIを使う複雑な構成(`_domain` / `_usecases` / `_infrastructure`、Route Handler)の手本は`app/apps/clean-tasks/`を参照する。

### Aboutページの作り方

`app/apps/<app-name>/about/page.tsx`は`app/apps/_components/app-about-shell.tsx`の`AppAboutShell`を使う。`AppAboutShell`は次の情報を受け取り、共通のレイアウトとして表示する。

- `appName` / `ddLabel`: アプリ名と〇〇DD
- `paragraphs`: 制作経緯やパッションを語る段落（文字列の配列）
- `youtubeUrl` / `youtubeThumbnailUrl`: YouTube導線（`app-links.ts`の値を使う）
- `referenceLinks`: 参考にした作品やコンテンツへの通常リンク（`label` / `href` / 任意の`description`）

```tsx
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";
import { appLinks } from "@/app/apps/_lib/app-links";

// ↓ ここを編集する
const paragraphs = ["..."] as const;
const referenceLinks = [{ label: "...", href: "...", description: "..." }] as const;
// ↑ ここまで

const appLink = appLinks.find((a) => a.slug === "<app-name>");

export default function ExampleAboutPage() {
  return (
    <AppAboutShell
      appName="Example"
      ddLabel="〇〇DD"
      paragraphs={paragraphs}
      youtubeUrl={appLink?.status === "published" ? appLink.youtubeUrl : undefined}
      youtubeThumbnailUrl={appLink?.status === "published" ? appLink.thumbnailUrl : undefined}
      referenceLinks={referenceLinks}
    />
  );
}
```

`paragraphs`と`referenceLinks`はファイル冒頭の定数としてまとめ、編集箇所を狭くする。ここに書く文章はAIが代筆せず、人間が自分の言葉で書く・確認する。実装例は`app/apps/clean-tasks/about/page.tsx`を参照する。

参考リンクへの画像表示やアフィリエイトリンクは、Vercel Hobby利用中は追加しない。収益化のタイミングで`docs/pr/0072-decide-app-page-information-architecture.md`を踏まえた別Issueで扱う。

`layout.tsx`の`availablePages`へ`"about"`を追加すると、アプリ内ナビのAboutタブが有効になる。

MVP PRは通常どおり`dev`へ向け、CI成功後にsquash mergeする。Issueはmergeによる自動close、またはmerge確認後の手動closeで完了させる。

### Guideページの作り方

`app/apps/<app-name>/guide/page.tsx`は`app/apps/_components/app-guide-shell.tsx`の`AppGuideShell`を使う。`AppGuideShell`は次の5セクションを必ず受け取り、共通のレイアウトとして表示する。いずれも省略や空表示はできない（型レベルで1要素以上を必須にしている）。

- `firstSteps`: 最初に行う操作（番号付きリストで表示）
- `basicControls`: 基本操作
- `screenGuide`: 画面の見方（他より少し大きい文字で表示）
- `rules`: ルール
- `tips`: 困ったときは（深刻な注意点が無い場合は、ふざけた一言でもよい）

```tsx
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

// ↓ ここを編集する
const firstSteps = ["...", "..."] as const;
const basicControls = ["...", "..."] as const;
const screenGuide = ["...", "..."] as const;
const rules = ["...", "..."] as const;
const tips = ["..."] as const;
// ↑ ここまで

export default function ExampleGuidePage() {
  return (
    <AppGuideShell
      appName="Example"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      tips={tips}
    />
  );
}
```

各配列はファイル冒頭の定数としてまとめ、編集箇所を狭くする。実装例は`app/apps/clean-tasks/guide/page.tsx`を参照する。

図や画像が必要になった場合は`app/apps/<app-name>/_assets/`へ置き、静的importで読み込む（`docs/guides/assets.md`参照）。

`layout.tsx`の`availablePages`へ`"guide"`を追加すると、アプリ内ナビのGuideタブが有効になる。

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
- 本人へ`1200×630`のPNG形式のOpen Graph画像を依頼する。
- 受け取った画像とaltを同じ内容で`opengraph-image.*`と`twitter-image.*`へ格納する。
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

公開metadataの厳格検査は`main`向けrelease PRで実行する。OG画像が未準備でも途中の変更を`dev`へmergeできるが、画像、alt、公開情報が揃うまでrelease PRのCIは成功しない。

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
