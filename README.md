# お弁当考えるアプリ

お弁当の中身と配置を楽しく考えられるスマホアプリです。食材をドラッグ＆ドロップで配置し、様々な評価軸でお弁当の提案を受けることができます。

## 主な機能

### 1. お弁当デザイン機能
- お弁当箱の形状選択（現在は長方形のみ対応）
- 仕切りの設定（2分割対応）
- 食材のドラッグ＆ドロップ配置
- 食材のサイズ調整
- 配置済み食材の移動・削除（パズドラ風のスムーズな動き）

### 2. 食材管理
- 20種類の基本食材を事前登録
- ユーザーによる食材追加機能
- AsyncStorageによるデータ永続化

### 3. お弁当提案機能
5つの評価軸から選んでお弁当を提案：
- **速さ重視**: 冷凍食品や詰めるだけの食材を優先
- **栄養バランス重視**: ビタミンなど栄養素のバランスを考慮
- **いろどり重視**: 赤・黄・緑など色のバランスを重視
- **季節感重視**: 旬の食材を優先
- **コスト重視**: 安価な食材を優先

提案は1つずつ表示し、ユーザーが確認しながら進める方式

## 技術仕様
- **フレームワーク**: Expo (Expo Go)
- **言語**: TypeScript
- **対応デバイス**: スマートフォン（iOS/Android）
- **データ保存**: AsyncStorage（オフライン対応）
- **UI**: React Native

## インストール方法
```bash
# プロジェクトのセットアップ
npm install

# Expo Goでの起動
npx expo start
```

## 開発・デバッグ方法

### 基本的な起動
```bash
# 開発サーバー起動
npm start

# Android エミュレータで起動
npm run android

# iOS シミュレータで起動  
npm run ios

# Webブラウザで起動
npm run web
```

### デバッグモード
```bash
# キャッシュクリアして起動
npm run clear

# dev-clientモードで起動（カスタムネイティブコード使用時）
npm run dev

# トンネルモード（外部ネットワークアクセス）
npm run tunnel
```

### エミュレータ・シミュレータでのデバッグ

#### iOSシミュレータのセットアップ
1. **Xcodeのインストール**
   ```bash
   # Homebrewでmasをインストール（まだの場合）
   brew install mas
   
   # Mac App StoreからXcodeをインストール
   mas install 497799835
   
   # または手動でApp Storeから「Xcode」を検索してインストール
   ```

2. **Xcode開発者パスの設定**
   ```bash
   # Xcodeインストール後、開発者パスを設定
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   
   # ライセンス同意
   sudo xcodebuild -license accept
   ```

3. **iOSシミュレータの確認**
   ```bash
   # 利用可能なシミュレータを確認
   xcrun simctl list devices available
   
   # シミュレータの起動テスト
   open -a Simulator
   ```

4. **アプリ起動**
   ```bash
   npm run ios
   ```

#### Androidエミュレータのセットアップ
1. **Android Studioのインストール**
   ```bash
   # Homebrewでインストール
   brew install --cask android-studio
   
   # または手動ダウンロード
   # https://developer.android.com/studio
   ```

2. **初回セットアップ**
   - Android Studioを起動
   - Setup Wizardに従って必要なコンポーネントをインストール
   - Android SDK、Android SDK Platform、Android Virtual Device

3. **Android SDK の設定**
   - Android Studio > Settings > Appearance & Behavior > System Settings > Android SDK
   - 以下をインストール:
     - ✅ Android 14.0 (API 34) - 推奨
     - ✅ Android SDK Build-Tools 34.0.0
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools

4. **環境変数の設定**
   ```bash
   # ~/.zshrc または ~/.bash_profile に追加
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   
   # 設定を反映
   source ~/.zshrc
   ```

5. **AVD（Android Virtual Device）の作成**
   - Android Studio > Tools > AVD Manager
   - "Create Virtual Device"をクリック
   - **推奨設定**:
     - Device: Pixel 7 または Pixel 7 Pro
     - System Image: API 34 (Android 14.0)
     - RAM: 4GB以上
     - Internal Storage: 8GB以上

6. **インストール確認**
   ```bash
   # Android SDK の確認
   adb version
   
   # 作成したエミュレータの確認
   emulator -list-avds
   
   # エミュレータの起動テスト
   emulator -avd [AVD名]
   ```

7. **アプリ起動**
   ```bash
   npm run android
   ```

#### トラブルシューティング
- **iOS**: Xcodeのライセンス同意を忘れずに
- **Android**: 環境変数PATHの設定を確認
- **共通**: エミュレータ起動後にアプリ起動コマンドを実行

### VSCode デバッグ設定
- **Attach to Metro**: 既に起動中のMetroサーバーにアタッチ
- **Debug Android**: Androidエミュレータでデバッグ起動
- **Debug iOS**: iOSシミュレータでデバッグ起動
- **Debug Web**: Webブラウザでデバッグ起動

### テスト実行
```bash
# 全テスト実行
npm test

# ウォッチモード（変更時に自動実行）
npm run test:watch
```

## 使い方
1. アプリを起動し、お弁当箱の形を選択
2. 仕切りを設定（ごはんエリア・おかずエリア）
3. 食材リストから食材をドラッグしてお弁当箱に配置
4. 必要に応じて食材のサイズを調整
5. 評価軸を選んで提案を受ける

## 今後の拡張予定
- お弁当箱の形状追加（曲げわっぱ、2段重ね等）
- 自由な仕切り設定
- 賞味期限・在庫数管理
- お気に入りレシピ保存
- 履歴機能