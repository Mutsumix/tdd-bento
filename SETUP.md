# iOS・Android エミュレータ セットアップガイド

このガイドではbento-appをiOSシミュレータとAndroidエミュレータで実行するための環境構築手順を説明します。

## 前提条件

- macOS 15.0以上
- Homebrew（推奨）
- Node.js 18以上
- npm または yarn

## iOS開発環境のセットアップ

### 1. Xcode のインストール

#### 方法A: Mac App Store（推奨）
```bash
# masコマンドでインストール（Homebrewが必要）
brew install mas
mas install 497799835  # Xcode
```

#### 方法B: 手動インストール
1. Mac App Storeを開く
2. "Xcode"で検索
3. 「入手」をクリック（約15GB、30分〜1時間）

### 2. Xcode 初期設定

```bash
# Xcodeの開発者パスを設定
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# ライセンス同意（重要！）
sudo xcodebuild -license accept

# 最新のiOS Simulatorを確認
xcrun simctl list devices available
```

### 3. iOS Simulator の起動テスト

```bash
# Simulatorを起動
open -a Simulator

# または特定のデバイスを起動
xcrun simctl boot "iPhone 15 Pro"
```

### 4. bento-app を iOS で実行

```bash
cd /path/to/bento-app
npm run ios
```

**期待される動作:**
- Metro bundlerが起動
- iOS Simulatorが自動で開く
- アプリがインストール・起動

## Android開発環境のセットアップ

### 1. Android Studio のインストール

```bash
# Homebrewでインストール（推奨）
brew install --cask android-studio
```

### 2. Android Studio 初期設定

1. **Android Studioを起動**
2. **Setup Wizard に従う**
   - Standard setup を選択
   - Android SDK、AVD、Emulatorを含むコンポーネントをインストール

3. **追加SDKの設定**
   - Android Studio > Settings (⌘+,)
   - Appearance & Behavior > System Settings > Android SDK
   - **SDK Platforms** タブ:
     - ✅ Android 14.0 (API 34) ← **重要**
     - ✅ Android 13.0 (API 33)
   - **SDK Tools** タブ:
     - ✅ Android SDK Build-Tools 34.0.0
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
     - ✅ Intel x86 Emulator Accelerator (HAXM installer)

### 3. 環境変数の設定

```bash
# ~/.zshrc に追加
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc

# 設定を反映
source ~/.zshrc

# 確認
echo $ANDROID_HOME
adb version
```

### 4. Android Virtual Device (AVD) の作成

1. **AVD Manager を開く**
   - Android Studio > Tools > AVD Manager

2. **新しいAVDを作成**
   - "Create Virtual Device" をクリック
   - **Device**: Pixel 7 Pro を選択（推奨）
   - **System Image**: API 34 (Android 14.0) を選択
     - まだダウンロードしていない場合は「Download」をクリック

3. **AVD設定（推奨値）**
   ```
   AVD Name: Pixel_7_Pro_API_34
   Device: Pixel 7 Pro
   Target: Android 14.0 (API level 34)
   CPU/ABI: arm64-v8a
   RAM: 4096 MB
   Internal Storage: 8192 MB
   ```

### 5. エミュレータの起動テスト

```bash
# 作成したAVDの確認
emulator -list-avds

# エミュレータを起動
emulator -avd Pixel_7_Pro_API_34

# またはAVD Managerから起動ボタンをクリック
```

### 6. bento-app を Android で実行

```bash
cd /path/to/bento-app

# エミュレータが起動していることを確認
adb devices

# アプリを実行
npm run android
```

**期待される動作:**
- Metro bundlerが起動
- Androidエミュレータでアプリが自動インストール・起動

## VSCode でのデバッグ

### 設定済みのデバッグ構成

bento-appには以下のVSCode設定が含まれています：

- **Debug iOS**: iOSシミュレータでデバッグ
- **Debug Android**: Androidエミュレータでデバッグ
- **Attach to Metro**: 実行中のMetroサーバーにアタッチ

### デバッグの手順

1. **エミュレータを起動**
   ```bash
   # iOS
   open -a Simulator
   
   # Android
   emulator -avd Pixel_7_Pro_API_34
   ```

2. **VSCodeでブレークポイントを設定**

3. **デバッグを開始**
   - F5キーまたは「実行とデバッグ」パネルから
   - 適切な構成（Debug iOS/Android）を選択

## トラブルシューティング

### iOS関連

**問題**: `xcrun: error: unable to find utility "simctl"`
```bash
# 解決策: Xcode開発者パスを正しく設定
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

**問題**: `error: RCTBridgeModule class is not found`
```bash
# 解決策: Metroキャッシュをクリア
npm run clear
```

### Android関連

**問題**: `ANDROID_HOME environment variable not set`
```bash
# 解決策: 環境変数を確認・再設定
echo $ANDROID_HOME
source ~/.zshrc
```

**問題**: `No connected devices found`
```bash
# 解決策: エミュレータの状態確認
adb devices
emulator -list-avds
```

**問題**: `SDK location not found`
```bash
# 解決策: Android SDKパスを確認
ls $ANDROID_HOME
# 通常: /Users/[username]/Library/Android/sdk
```

### 共通問題

**問題**: Metro bundlerが起動しない
```bash
# 解決策: ポートが使用中の場合
npx react-native start --reset-cache --port 8082
```

**問題**: アプリが白い画面で止まる
```bash
# 解決策: 依存関係の再インストール
npm install
cd ios && pod install && cd ..  # iOSの場合
npm run clear
```

## 次のステップ

環境構築が完了したら：

1. **デバッグの練習**: ブレークポイントを設定して動作確認
2. **ホットリロードの確認**: コードを変更して即座に反映されるか確認
3. **実機テスト**: 開発が進んだら実機での動作確認も推奨

## 参考リンク

- [Expo Development Environment](https://docs.expo.dev/get-started/installation/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [Android Studio User Guide](https://developer.android.com/studio/intro)