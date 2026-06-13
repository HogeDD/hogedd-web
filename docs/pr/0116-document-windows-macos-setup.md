# WindowsとmacOSのセットアップ方法をマニュアル化する

## 背景

初参加者がWindowsで開発を始めた際、Gitが入っておらず、VS Code、Node.js、GitHub認証を含む環境構築に時間がかかった。既存のlocal development guideは、必要なtoolsが導入済みであることを前提に`npm install`から始まっていた。

READMEのproject名も移管後のrepository名`hogedd-web`と一致せず、新しいアプリを作る前に読むべき必須ルールが後半に置かれていた。

## 決定したこと

- READMEのproject名とnpm package名を`hogedd-web`へ統一する。
- READMEの冒頭へアプリ開発前の必須事項を置く。
- 詳細なセットアップは`docs/guides/local-dev.md`へ集約する。
- WindowsはGit for Windows、Node.js 24 LTS、VS Codeを公式installerで導入する。
- macOSはCommand Line Tools、Node.js 24 LTS、VS Codeを公式installerで導入する。
- 両OSでGit author情報、HTTPS clone、dependency installation、dev server起動まで説明する。
- Windows PowerShellとmacOSで異なる環境変数の指定方法を分けて記載する。
- onboarding guideに残っていた旧`API` CIとIssue自動closeの誤案内を現在の運用へ合わせる。

## 理由

初参加者が「何をinstallするか」を自分で推測せず、公式配布元から順に導入して画面表示まで到達できるようにするためである。

READMEには全員が作業前に守る短いルールだけを置き、OS別の長い操作はlocal development guideへ分ける。開発フローはonboarding guide、アプリ固有の進め方はapp development cycleへ分け、同じ説明の重複を避ける。

Node.jsはrepositoryの`.node-version`、CI、Vercelと同じ24系を使用する。cloneは最初の導入が比較的単純でnetwork制約を受けにくいHTTPSを標準手順とする。

## 検討した代替案

### GitHub Desktopを標準手順にする

GitHub認証は分かりやすいが、既存の開発手順はGit commandを使用し、terminalでの状態確認も必要になる。追加toolを増やさず、GitとVS Codeで完結する手順を採用する。

### HomebrewやNode version managerを必須にする

複数projectのversion管理には有効だが、package managerやshell設定の説明が追加で必要になる。最初の一台でHogeDDを動かす手順としては公式installerを優先する。

### WindowsでWSLを使用する

本番に近いLinux環境を使えるが、Windows、WSL、VS Code extensionの境界が増える。現在のNext.js projectはWindows上のNode.jsで開発できるため、標準手順には採用しない。

## トレードオフ

- Node.jsのminor versionが更新されるため、手順では固定versionではなく`v24.x LTS`と表現する。
- installerの画面やVS Codeのmenu表記は将来変わる可能性がある。
- 複数のNode.js projectを扱う人にはversion managerの方が適するが、このguideでは扱わない。
- HTTPS push時のGitHub認証画面はOSとcredential helperによって異なるため、passwordではなくbrowser認証を使う原則を記載する。

## テスト・検証内容

- README、local development guide、onboarding guide間の役割とlinkを確認する。
- Windows PowerShellとmacOSで異なるcommandを分けて記載していることを確認する。
- `.node-version`、package name、repository URLがguideと一致することを確認する。
- 共同開発者がIssue、branch、PR、CI、mergeの開発サイクルへ参加できたことを確認した。
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## 今後の見直し条件

- 初参加者がこの手順で詰まった箇所が見つかったとき。
- Node.jsの採用major versionを変更するとき。
- GitHub認証、VS Code、Git installerの標準手順が変わったとき。
- WindowsでWSLが必要な開発要件を追加するとき。
