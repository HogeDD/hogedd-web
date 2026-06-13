# 新規アプリの共通ページ構成を自動検査する

## 背景

App、About、Guideの共通フォーマットを複数アプリへ適用したが、注意書きだけでは新規アプリ追加時にroute、layout、共通shell、metadataの追加漏れを防げない。新しいアプリを自動的に検査対象へ含め、CIで構成を守る必要があった。

## 決定したこと

- `app/apps/`直下で`page.tsx`を持つprivate folder以外のdirectoryをアプリとして自動検出する。
- 検出したslugと`app-links.ts`へ登録されたslugの集合が一致することを検査する。
- 各アプリにApp、About、Guide、layoutのroute fileがあることを検査する。
- layoutが`AppPageShell`を使い、正しい`appHref`と3ページの`availablePages`を渡すことを検査する。
- AboutとGuideがそれぞれ`AppAboutShell`と`AppGuideShell`を使うことを検査する。
- Guideが5つの必須section propsを渡すことを検査する。
- 3ページが`createPageMetadata`へrouteと一致するpathを渡すことを検査する。
- 検査はTypeScript ASTで行い、改行、format、import順には依存させない。

## 理由

folderの自動検出と`app-links`との集合比較により、新規アプリを追加したときにテスト対象の配列を手動更新する必要がない。共通componentの利用と外部へ現れるroute契約だけを検査し、component内部のclass名や本文には依存しないため、小さなUI変更で壊れにくい。

## 検討した代替案

### source codeを文字列検索する

実装は短くなるが、改行やformat変更で壊れやすく、同名のcommentや文字列も誤検出するため採用しない。

### ページをrenderして検査する

表示結果を確認できるが、Next.jsのServer Componentとmetadataをunit test環境でrenderする準備が大きい。今回守りたいのはrouteと共通構成の契約なので採用しない。

### アプリ専用OG画像も必須にする

情報設計ではアプリ単位のOG画像を必要としているが、現在は公開準備Issueで追加する運用であり、未公開MVPにも必須化すると開発サイクルと衝突する。公開準備の自動検査は公開状態を扱う別Issueで検討する。

この未対応範囲は、後続のIssue #111へ分けた。

## トレードオフ

- AST検査はTypeScript / TSXで実装する現在の方針を前提とする。
- metadataのtitleやdescription本文までは固定しないため、コピーの品質は人の確認が必要になる。
- アプリ専用OG画像の追加漏れは、このテストだけでは検出しない。

## テスト・検証内容

- 現在の3アプリが同じ構造検査を通ることを確認した。
- 必須routeが欠けたfixtureで、欠けたfileが報告されることを確認した。
- 共通shell、Guideの必須props、metadata pathが不正なfixtureで、各問題が報告されることを確認した。
- format、lint、typecheck、全unit testを実行する。

## 今後の見直し条件

- 公開準備の状態をコード上で判定し、OG画像や公開metadataを自動検査できるようになったとき。
- Next.jsのfile conventionまたはアプリ共通ページ構成を変更するとき。
- AST検査では表現できない共通契約が増え、component testやE2E testの方が単純になったとき。
