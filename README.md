# 過去問K.I.T.A - 過去問共有アプリ

## 作品概要

**作品名：** 過去問K.I.T.A  
**理由：** 探していた過去問が来た！という喜びを表している。本学の略称KITが入っている。

**制作目的と理由（背景を含む）**

- プロジェクトで忙しい工大生のために効率よく勉強をしてほしい。
- 自分たちが単位を必ず取得したい。
- 過去問をもらえる人ともらえない人の差を埋めたい。

**技術スタック：**

- **フロントエンド：** HTML/CSS, JavaScript, Vite
- **バックエンド：** Firebase (Authentication, Firestore, Storage)
- **開発・デプロイ：** Git/GitHub, Firebase Hosting

**ターゲット：** 金沢工業大学情報工学科の学生

---

## このドキュメントについて

このドキュメントは、金沢工業大学における学内ハッカソン「Hackit（ハックイット）」で開発する作品のREADMEです。

**参考リンク：**

- [Hackit2025 公式サイト](https://hackit-website.vercel.app/)
- [Hackit2025 Notion](https://kit-hackit.notion.site/Hackit-Connect-2025-23219ee67e9b80f89e89e4b762bbb0f0)
- [メンバー専用ページ](https://www.notion.so/s-taku/Hackit-2025-24024677fc6680e1a809d7f83dfd538e)

## チーム構成

### メンバー自己紹介

#### @asaki-mahiro （1年生・バックエンド）

- 富山県出身
- 興味：寝る、通話
- 触ったことのある言語：Python、触ってみたい言語：C言語
- ハッカソンでの意気込み：頑張ります！

#### @yamasaku-04 （1年生・フロント）

- 富山県出身
- 興味：読書、ゲーム
- 経験言語：Python、JavaScript、Ruby on Rails、C言語
- ハッカソンでの意気込み：わかんないことだらけですが、頑張ります！！！

#### @TAK0-wasa（2年生・フロントエンド）

- 石川県出身
- 興味：ゲーム
- 経験言語：Python、C、Ruby、Java、HTML/CSS/JS
- 興味がある言語：Ruby
- ハッカソンでの意気込み：ガンバル！

#### @maya92176（2年生・バックエンド）

- 石川県出身
- 興味：ゲーム、音楽
- 経験言語：Python、Java、C、HTML/CSS/JS、Ruby/Ruby on Rails
- 興味分野：バックエンド？？
- ハッカソンでの意気込み：頑張る

#### @s-taku0502（2年生・リーダー・フルスタック）

- 富山県出身
- 興味：睡眠、仮眠、惰眠、旅行
- 経験言語：Python、HTML/CSS/JS、Ruby/Ruby on Rails、Markdown、TinyGo
- 興味がある言語：Markdown、TinyGo
- ハッカソンでの意気込み：とにかく初めは楽しんでもらって、壁に当たったらみんなで乗り越えるっていう経験をしてほしい。

**チーム構成：**
- 大学1年生：2名
- 大学2年生：3名

チーム開発が初めてのメンバーが中心のため、以下の開発ガイドラインに従って進めていきます。

## 機能一覧

### 現在実装済みの機能

#### フロントエンド
- [x] ホーム画面 (`/index.html`)
- [x] ログイン画面 (`/login.html`)
- [x] 新規登録画面 (`/signup.html`)
- [x] 過去問閲覧画面 (`/viewer/past_question/past_questions_all.html`)
- [x] 過去問投稿画面 (`/contributor/new.html`)
- [x] 質問一覧画面 (`/viewer/question/list.html`)
- [x] 質問詳細画面 (`/viewer/question/detail.html`)
- [x] 質問投稿画面 (`/viewer/question/new.html`)
- [x] 404エラーページ (`/404.html`)
- [x] パスワード再設定画面 (`/forgot-password.html`)
- [x] 利用規約ページ (`/terms.html`)

#### バックエンド（Firebase）
- [x] ユーザー認証機能（サインアップ・ログイン）
- [x] Firestore データベース
- [x] 過去問ファイルアップロード機能
- [x] 質問投稿・返答機能
- [x] 閲覧履歴機能
- [x] リアルタイムコメント機能
- [x] いいね機能
- [x] ファイルストレージ機能

### 主要機能の詳細

#### 1. 過去問共有機能
- 年度別、科目別での過去問分類
- PDFファイルのアップロード・ダウンロード
- 教員名の任意記入
- 検索・フィルタリング機能

#### 2. 質問・返答システム
- 過去問に関する質問投稿
- リアルタイムコメント機能
- いいね・解決済み機能
- 質問の削除機能

#### 3. ユーザー管理
- メールアドレス・パスワード認証
- ユーザープロフィール管理
- 投稿履歴・閲覧履歴

#### 4. セキュリティ機能
- Firestore Security Rules
- Firebase Storage Rules
- 金沢工業大学情報工学科学生限定利用

### ペルソナ設定

- **年齢：** 大学生（金沢工業大学情報工学科）
- **状況：** 過去問が見たい、過去問のわからないところを質問したい、質問に対して返信したい、過去問を共有したい
- **ユーザー像：** 切羽詰まった人、傾向をつかみたい人
- **解決したい課題：** 
  - プロジェクトで忙しい工大生のために効率よく勉強をしてほしい
  - 自分たちが単位を必ず取得したい
  - 過去問をもらえる人ともらえない人の差を埋めたい

### 将来的に追加したい機能

- [ ] 現在のアプリを利用しているユーザー表示
- [ ] 過去問出題機能
- [ ] 通話機能（オンライン自習室）
- [ ] より詳細な検索・フィルタリング
- [ ] モバイル対応（レスポンシブデザイン）

---

## 開発進捗状況

### 第1日程（企画・設計段階）

#### 午前の部
**フロントエンド**
- [Stitch](http://stitch.withgoogle.com/) を利用してプロトタイプ作成
- ウェブ（PC）画面で想定（工大生全員がPCを持っているため）

**バックエンド**
- [Firebase](https://firebase.google.com/?hl=ja) と [Supabase](https://supabase.com/) を比較検討
- Firebaseを選定

### 第2日程（実装開始）

#### フロントエンド進捗
**完了した作業：**
- 過去問のアップロード画面
- 過去問のアップロード完了画面
- 必須項目の明示

**やったこと：**
- 機能の5割程度を完成

#### バックエンド進捗
**完了した作業：**
- データ構造の理解と配置（構想）
- サンプルプロジェクトにおけるアップロード機能
- 閲覧機能
- 一覧表示機能

**やったこと：**
- Firebaseを習得

### 第2日程 詳細進捗報告

#### フロントエンド（@TAK0-wasa @yamasaku-04）

**挑戦したこと：**
- @TAK0-wasa：
  - [任意で教員を書けるようにする](https://github.com/s-taku0502/hackit2025/issues/11)
  - [質問一覧の作成](https://github.com/s-taku0502/hackit2025/issues/28)
  - [質問投稿からのページ遷移とUI変更](https://github.com/s-taku0502/hackit2025/issues/27)
- @yamasaku-04：
  - ヘッダーのCSSの調整

**挑戦してできたこと・わかったこと：**
- @TAK0-wasa：
  - HTML/CSSが結構書けるようになった
  - チーム開発の仕方をわかった
- @yamasaku-04：
  - HTML/CSSがムズイことが分かった
  - 様々な単語を知った

#### バックエンド（@maya92176 @asaki-mahiro）

**挑戦したこと：**
- @maya92176：
  - サインアップ機能
  - ログイン機能
  - 過去問アップロード機能
- @asaki-mahiro：
  - ダウンロード機能
  - 閲覧履歴機能

**挑戦してできたこと・わかったこと：**
- @maya92176：
  - でぎだ（実装成功）
- @asaki-mahiro：
  - でぎだっ！（実装成功）
  - 脱宇宙猫、理解犬（理解が深まった）
  - ちょっとわかってきたかも？
  - AIすごい

---

## 開発セットアップ

### 前提条件

このプロジェクトはUbuntu環境での開発を前提としています。

### 0. 環境セットアップ

まず、Ubuntu環境に移行してください：

```bash
# Ubuntu環境に入る
ubuntu
```

### 1. プロジェクトディレクトリの作成

```bash
# Hackitディレクトリを作成
mkdir Hackit
```

### 2. リポジトリのクローン

次に、このリポジトリをクローンします：

```bash
# リポジトリをクローン
git clone https://github.com/s-taku0502/hackit2025.git

# プロジェクトディレクトリに移動
cd hackit2025
```

### 3. 初期設定

クローン後、以下を確認してください：

```bash
# 現在のブランチを確認
git branch

# リモートリポジトリの確認
git remote -v
```

## 開発フロー（重要）

### ブランチの作成と切り替え

**重要：直接 `main` ブランチで作業しないでください！**

#### 作業開始前に必ずブランチを作成

```bash
# 最新のmainブランチに移動
git checkout main

# 最新の変更を取得
git pull origin main

# 新しいブランチを作成して切り替え
git checkout -b feature/あなたの名前-機能名
# 例: git checkout -b feature/sudo-login
```

#### ブランチ名の命名規則

- `feature/名前-機能名` （新機能の場合）
  - 例: `feature/sudo-login`
  - 例: `feature/yamada-user-registration`
  - 例: `feature/sato-home-page`

- `fix/名前-修正内容` （バグ修正の場合）
  - 例: `fix/sudo-login-error`
  - 例: `fix/yamada-button-style`
  - 例: `fix/sato-responsive-design`

- `docs/名前-ドキュメント名` （ドキュメント更新の場合）
  - 例: `docs/sudo-readme-update`
  - 例: `docs/yamada-api-documentation`
  - 例: `docs/sato-setup-guide`

### 作業の進め方

#### 1. コードを書く

#### 2. 変更をステージング

```bash
# 特定のファイルを追加
git add ファイル名

# すべての変更を追加（慎重に！）
git add .
```

#### 3. コミット

```bash
git commit -m "わかりやすいコミットメッセージ"
# 例: git commit -m "ログイン画面のHTMLを作成"
```

#### 4. プッシュ

```bash
git push origin ブランチ名
```

#### 5. プルリクエスト作成

- GitHubのWebページでプルリクエストを作成
- チームメンバーにレビューを依頼

## チーム開発のルール

### コミットメッセージの書き方

- **日本語OK**
- **何をしたかを明確に**

良い例：

- `ログイン画面のHTMLとCSSを作成`
- `ユーザー登録機能のバグを修正`
- `READMEに開発手順を追加`

悪い例：

- `修正`
- `とりあえず`
- `test`

### プルリクエストのルール

1. **必ずレビューを受ける**
2. **機能ごとに小さく分割**
3. **説明を詳しく書く**

## プロジェクト構成

```text
hackit2025/
├── README.md                       # プロジェクトドキュメント
├── LICENSE                         # MITライセンス
├── package.json                    # Node.js依存関係
├── vite.config.js                  # Viteビルド設定
├── firebase.json                   # Firebase設定
├── firestore.rules                 # Firestoreセキュリティルール
├── storage.rules                   # Firebase Storageルール
├── .env                            # 環境変数設定
├── .firebaserc                     # Firebaseプロジェクト設定
├── .gitignore                      # Git除外設定
├── index.html                      # ホーム画面
├── login.html                      # ログイン画面
├── signup.html                     # 新規登録画面
├── forgot-password.html            # パスワード再設定画面
├── terms.html                      # 利用規約ページ
├── 404.html                        # 404エラーページ
├── firebase.js                     # Firebase設定・関数
├── dist/                           # ビルド済みファイル（本番用）
├── css/                            # スタイルシート
│   ├── common.css                  # 共通スタイル
│   ├── index.css                   # ホーム画面スタイル
│   ├── login.css                   # ログイン画面スタイル
│   ├── signup.css                  # 新規登録画面スタイル
│   ├── contribute.css              # 投稿画面スタイル
│   ├── question.css                # 質問画面スタイル
│   ├── past_questions.css          # 過去問画面スタイル
│   └── (その他のCSSファイル)
├── js/                             # JavaScript
│   ├── index.js                    # ホーム画面スクリプト
│   ├── login.js                    # ログイン機能
│   ├── signup.js                   # 新規登録機能
│   ├── contribute.js               # 投稿機能
│   ├── question-list.js            # 質問一覧機能
│   ├── question-detail.js          # 質問詳細機能
│   ├── past_questions.js           # 過去問機能
│   └── (その他のJSファイル)
├── img/                            # 画像ファイル
│   ├── hackit.png                  # ロゴ画像
│   ├── pastpaper.png               # 過去問アイコン
│   ├── Q&A.png                     # Q&Aアイコン
│   └── (その他の画像)
├── contributor/                    # 投稿者向けページ
│   ├── new.html                    # 過去問投稿画面
│   └── upload.html                 # アップロード画面
├── viewer/                         # 閲覧者向けページ
│   ├── question_history.html       # 質問履歴
│   ├── past_question/              # 過去問関連
│   │   ├── past_questions_all.html # 過去問一覧
│   │   └── past_questions.html     # 過去問詳細
│   └── question/                   # 質問関連
│       ├── list.html               # 質問一覧
│       ├── detail.html             # 質問詳細
│       └── new.html                # 質問投稿
├── components/                     # 再利用可能コンポーネント
│   └── footer.html                 # フッターコンポーネント
└── node_modules/                   # Node.js依存関係（自動生成）
```

### 技術スタック詳細

#### フロントエンド
- **HTML5/CSS3**: セマンティックなマークアップとモダンCSS
- **JavaScript (ES6+)**: モジュールシステム使用
- **Vite**: 高速ビルドツール、開発サーバー
- **レスポンシブデザイン**: CSS Grid, Flexbox

#### バックエンド
- **Firebase Authentication**: ユーザー認証
- **Cloud Firestore**: NoSQLデータベース
- **Firebase Storage**: ファイルストレージ
- **Firebase Security Rules**: セキュリティ制御

#### 開発・デプロイ
- **Git/GitHub**: バージョン管理
- **npm/Node.js**: パッケージ管理
- **Firebase CLI**: デプロイメント

## 困ったときは

### よくある問題と解決方法

#### `git push`でエラーが出る場合

```bash
# リモートの最新を取得してマージ
git pull origin main
git push origin ブランチ名
```

#### 間違ったブランチで作業してしまった場合

```bash
# 現在のブランチを確認
git branch

# 正しいブランチに切り替え
git checkout 正しいブランチ名
```

#### コンフリクト（競合）が発生した場合

- チームメンバーに相談する
- 一人で解決しようとしない

### サポート

- わからないことがあったら、すぐにチームメンバーに相談
- Slack/Discord等のチャットで質問を共有
- 画面共有でサポートし合う

---

## 開発スケジュール

### 全体スケジュール

**Hackit 2025 開催日：** 8月3日〜4日  
**事前制作開始：** 7月26日（キックオフミーティング後）  
**現在の状況：** 実装フェーズ（第2日程完了）

### 実績スケジュール

#### 7/27 〜 7/29：アイデア出し・議論（完了）

**達成した内容：**

1. **制作物の決定**
   - ウェブアプリ（過去問共有システム）
   - PC向けサービス（工大生全員がPCを持っているため）

2. **サービス概要の確定**
   - 金沢工業大学情報工学科向け過去問共有プラットフォーム
   - 課題：過去問格差の解消、効率的な学習支援

3. **技術スタックの決定**
   - フロントエンド：HTML/CSS/JavaScript + Vite
   - バックエンド：Firebase (Authentication, Firestore, Storage)
   - フレームワーク：なし（シンプルな構成）

#### 7/30 〜 8/2：企画決定・プロトタイプ作成（完了）

**達成した内容：**

1. **ペルソナ設定完了**
   - ターゲット：金沢工業大学情報工学科学生
   - ユーザー像：切羽詰まった人、傾向をつかみたい人

2. **機能設計完了**
   - 過去問アップロード・ダウンロード機能
   - 質問・返答システム
   - ユーザー認証機能
   - 閲覧履歴機能

#### 8/2 〜 8/4：本格的な制作期間（進行中）

**8/3-8/4実績：**
- 基本的なUI/UX実装（フロントエンド）
- Firebase連携機能実装（バックエンド）
- 主要機能の80%完成

#### 8/2 ～ 8/4：Hackit 2025 本番（完了）

**最終日実績：**
- [x] 最終デバッグ・テスト
- [x] UI/UXの微調整
- [x] 発表資料作成
- [x] デモ準備
- [x] ハッカソン発表完了
- [x] README.md最終更新

**プロジェクト完了**

**最終成果：**
- 金沢工業大学情報工学科向け過去問共有プラットフォーム「過去問K.I.T.A」
- Firebase を使用したフルスタック Web アプリケーション
- ユーザー認証、ファイルアップロード、質問・回答システムを実装
- チーム開発によるGit/GitHub運用の習得

---

## プロジェクト終了について

**重要：** 2025年8月5日をもって、本プロジェクトの開発を終了いたします。

- Hackit 2025 ハッカソン完了
- 最終発表実施済み
- README.md 最終更新完了
- 最終commit・push完了

**今後について：**
- このリポジトリでの編集・開発は行いません
- プロジェクトの記録として保存されます
- チームメンバーの学習・成長の証跡として残します

---

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。

---

**Hackit 2025 完了記録**

**最終更新：** 2025年8月5日（プロジェクト完了）  
**チーム：** Hackit 2025 さぁ、きっと（CirKit プロジェクト）  
**作品名：** 過去問K.I.T.A  
**リポジトリ：** [s-taku0502/hackit2025](https://github.com/s-taku0502/hackit2025)  
**開発期間：** 2025年7月27日 〜 2025年8月5日  

**参加メンバー：**
- @s-taku0502（リーダー・フルスタック）
- @TAK0-wasa（フロントエンド）
- @yamasaku-04（フロントエンド）
- @maya92176（バックエンド）
- @asaki-mahiro（バックエンド）

---

**メンバーのみんな、おつかれさま！
運営の方をはじめ、いい雰囲気を作ってくださった皆さん、ありがとうございました！**
