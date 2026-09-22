# ローカル開発手順

このガイドでは、開発ツールが入っていないWindowsまたはmacOSへ必要なものを導入し、`hogedd-web`を起動するところまで説明する。

このrepositoryはルートのNext.jsだけを起動すれば開発できる。別のAPI serverは必要ない。

## 用意するもの

- GitHub account
- GitHub Organization`HogeDD`への参加
- Git
- Node.js 24 LTS
- Visual Studio Code

インストーラーは非公式なまとめサイトではなく、次の公式サイトから取得する。

- Git: https://git-scm.com/downloads
- Node.js: https://nodejs.org/en/download
- Visual Studio Code: https://code.visualstudio.com/download

## Windowsの初回セットアップ

### 1. Gitを入れる

1. [Git for Windows](https://git-scm.com/download/win)を開く。
2. 通常のWindows PCでは64-bit版のinstallerをdownloadする。
3. installerを起動し、迷う項目は初期値のまま進める。
4. installation後、VS CodeやPowerShellを開いていた場合は一度閉じて開き直す。

PowerShellで確認する。

```powershell
git --version
```

versionが表示されれば完了。

### 2. Node.js 24 LTSを入れる

1. [Node.js download](https://nodejs.org/en/download)を開く。
2. `v24.x LTS`のWindows Installer (`.msi`)をdownloadする。
3. installerを初期値のまま進める。
4. PowerShellを開き直す。

確認する。

```powershell
node --version
npm --version
```

`node --version`が`v24`から始まれば完了。別のmajor versionが表示された場合は、Node.js 24 LTSを入れ直す。

### 3. VS Codeを入れる

1. [VS Code for Windows](https://code.visualstudio.com/docs/setup/windows)を開く。
2. 通常は`User Installer`をdownloadする。
3. installerを起動する。
4. `Add to PATH`が表示された場合は有効にする。

VS Codeを開き、左側のExtensionsから次をinstallする。

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)

### 4. Gitの名前とemailを設定する

VS Codeで`Terminal` → `New Terminal`を開き、PowerShellで実行する。

```powershell
git config --global user.name "GitHubで使う名前"
git config --global user.email "GitHubに登録したemail"
```

emailを公開したくない場合は、GitHubのEmail settingsに表示される`noreply` emailを使う。

## macOSの初回セットアップ

### 1. Gitを入れる

Terminalを開いて実行する。

```bash
xcode-select --install
```

確認画面が出たらCommand Line Toolsをinstallする。完了後に確認する。

```bash
git --version
```

versionが表示されれば完了。既に入っている場合、`xcode-select --install`はinstallation済みと表示されることがある。

### 2. Node.js 24 LTSを入れる

1. [Node.js download](https://nodejs.org/en/download)を開く。
2. `v24.x LTS`のmacOS Installer (`.pkg`)をdownloadする。
3. installerを起動する。
4. Terminalを開き直す。

確認する。

```bash
node --version
npm --version
```

`node --version`が`v24`から始まれば完了。

### 3. VS Codeを入れる

1. [VS Code for macOS](https://code.visualstudio.com/docs/setup/mac)を開く。
2. `.dmg`をdownloadして開く。
3. `Visual Studio Code.app`をApplications folderへ移動する。
4. VS Codeを起動する。
5. `Cmd + Shift + P`でCommand Paletteを開き、`Shell Command: Install 'code' command in PATH`を実行する。

左側のExtensionsから次をinstallする。

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)

### 4. Gitの名前とemailを設定する

Terminalで実行する。

```bash
git config --global user.name "GitHubで使う名前"
git config --global user.email "GitHubに登録したemail"
```

emailを公開したくない場合は、GitHubのEmail settingsに表示される`noreply` emailを使う。

## repositoryをcloneする

WindowsはPowerShell、macOSはTerminalで、保存したいfolderへ移動して実行する。

```bash
git clone https://github.com/HogeDD/hogedd-web.git
cd hogedd-web
code .
```

`code .`が使えない場合はVS Codeを開き、`File` → `Open Folder`から`hogedd-web` folderを選ぶ。

cloneは認証なしでもできる。最初のpushでGitHubへのsign inを求められた場合は、passwordを入力せず、表示されたbrowser認証を完了する。HogeDDは2FAを必須としているため、GitHubの2FAも完了させる。

## 最初の起動

VS Codeの`Terminal` → `New Terminal`を開く。terminalの現在位置が`hogedd-web`になっていることを確認して実行する。

```bash
npm install
npm run dev
```

terminalに表示された http://localhost:3000 をbrowserで開く。画面が表示されればセットアップ完了。

停止するときは、dev serverを実行しているterminalで`Ctrl + C`を押す。

Codexが検証用に起動する場合は、ユーザーが使う`3000`と競合しないよう`3100`を使う。

```bash
npm run dev -- --hostname 0.0.0.0 --port 3100
```

### Dockerで起動する

Node.jsをhostへ直接入れず、DockerでWebだけを起動する場合は次を実行する。

```bash
docker build -f Dockerfile.dev -t hogedd-web-dev .
docker run --rm --init \
  --publish 3000:3000 \
  --mount type=bind,source="$PWD",target=/workspace \
  --mount type=volume,source=hogedd-web-node-modules,target=/workspace/node_modules \
  --mount type=volume,source=hogedd-web-next,target=/workspace/.next \
  hogedd-web-dev
```

http://localhost:3000 をbrowserで開く。Next.jsがsource codeの変更を検知し、画面へ反映する。

`node_modules`と`.next`はDocker volumeへ保存され、hostのsource codeとは分離される。dependencyを変更した場合はimageを再buildする。APIやDBを含む統合起動は`hogedd-local`から行う。

## 作業を始める

作業はIssueを作成してから、最新の`dev`からbranchを作る。

```bash
git switch dev
git pull --ff-only origin dev
git switch -c feature/116-example
```

branch名のprefixとIssue番号は、実際の作業内容に合わせる。詳しい流れは[`onboarding.md`](onboarding.md)、新しいアプリは[`app-development-cycle.md`](app-development-cycle.md)を参照する。

## 環境変数

必要な場合は`.env.example`を参考に`.env.local`を作る。

```text
NEXT_ALLOWED_DEV_ORIGINS=192.168.10.102
```

`.env.local`はcommitしない。secretの実値は`.env.example`、Issue、PR、チャット、スクリーンショットへ載せない。

スマホなど別端末からdev serverへアクセスする場合は、アクセス元URLのhostを`NEXT_ALLOWED_DEV_ORIGINS`へ入れる。複数ある場合はcomma区切りにする。

## ngrokで外部端末から確認する

出先や別networkのスマホから開発中の画面を見る場合は、Next.jsを`3100`で起動し、そのportをngrokで公開する。

### 1. ngrok authtokenを設定する

ngrokのfree planでも、ローカルCLIからtunnelを起動するにはauthtokenが必要になることがある。未設定の場合は`ERR_NGROK_4018`で失敗する。

```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

authtokenはsecretとして扱い、repositoryやチャットへ載せない。誤って公開した場合はngrok dashboardで直ちにrevokeまたはrotateする。

### 2. Next.jsを3100番で起動する

```bash
npm run dev -- --hostname 0.0.0.0 --port 3100
```

### 3. ngrok tunnelを起動する

別terminalで実行する。

```bash
ngrok http 3100
```

表示された`https://...ngrok-free.app`のURLを外部端末で開く。

### 4. Next.jsのdev origin制限を通す

ngrok URLが拒否された場合は、ngrokのhostを`NEXT_ALLOWED_DEV_ORIGINS`へ追加してdev serverを再起動する。

macOS:

```bash
NEXT_ALLOWED_DEV_ORIGINS=xxxx.ngrok-free.app npm run dev -- --hostname 0.0.0.0 --port 3100
```

Windows PowerShell:

```powershell
$env:NEXT_ALLOWED_DEV_ORIGINS = "xxxx.ngrok-free.app"
npm run dev -- --hostname 0.0.0.0 --port 3100
```

LAN IPも許可する場合は、値をcomma区切りにする。

```text
192.168.10.102,xxxx.ngrok-free.app
```

## よくある失敗

### `git`、`node`、`npm`、`code`が見つからない

- installerを実行した後、terminalとVS Codeを閉じて開き直す。
- Windowsではinstallerの`Add to PATH`が有効だったか確認する。
- macOSの`code`だけ見つからない場合は、VS CodeのCommand PaletteからPATH追加をやり直す。

### `npm install`で権限エラーになる

- `sudo npm install`や管理者PowerShellで回避しない。
- Node.js 24 LTSを公式installerで入れ直し、通常権限のterminalで実行する。

### `EADDRINUSE`

既に同じportのprocessが動いている。別portにするか、既存processを止める。

### `Another next dev server is already running`

同じrepositoryで別のNext.js dev serverが動いている。既に起動中のterminalを探して利用するか、`Ctrl + C`で停止してから起動する。

### GitHubへpushできない

- `git remote -v`で`https://github.com/HogeDD/hogedd-web.git`が表示されるか確認する。
- GitHubのpasswordはGit操作に使用できない。browser認証を完了する。
- Organization`HogeDD`のmemberになっているか確認する。

### ngrokで`ERR_NGROK_4018`が出る

authtokenを設定する。

### ngrok URLを開くとNext.jsに拒否される

`NEXT_ALLOWED_DEV_ORIGINS`へngrok hostを追加し、dev serverを再起動する。

### tokenを貼ってしまった

履歴修正より先にtokenをrevokeまたはrotateする。
