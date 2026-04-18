# KyumeiKosyu Deploy Guide

この手順書は、`KyumeiKosyu` を以下の構成で本番公開するためのものです。

- フロントエンド: `Vercel`
- API サーバー: `Vercel`
- データベース: `Neon PostgreSQL`

対象日は `2026-04-17` 時点の構成です。

## 1. 先に理解しておくこと

このプロジェクトは現在、フロントエンドと API が分かれています。

- フロント: React + Vite
- API: Express + Prisma + PostgreSQL

本番では次のように動かします。

1. ユーザーが `https://kyumei-kosyu.vercel.app` にアクセスする
2. フロントが API 用 Vercel プロジェクトにリクエストする
3. API が Neon PostgreSQL に接続する

重要なのは次の 2 つです。

- `VITE_API_BASE_URL`
  フロントが「どこに送るか」を決める
- `CLIENT_ORIGIN`
  API が「どこからのアクセスを許可するか」を決める

## 2. 先に必要なもの

作業前に次を用意してください。

- Vercel アカウント
- Neon アカウント
- GitHub リポジトリが Vercel から参照できる状態
- このリポジトリのローカル作業環境
- Node.js と npm がローカルで動くこと

このあと実際に決める値は次です。

- Neon PostgreSQL の接続 URL
- API 用 Vercel プロジェクトの公開 URL
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## 3. 本番で使う環境変数の一覧

### 3.1 API 用 Vercel プロジェクトに入れる値

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CLIENT_ORIGIN`

推奨値の例:

```env
DATABASE_URL=postgresql://...省略...
SESSION_SECRET=長いランダム文字列
ADMIN_USERNAME=admin
ADMIN_PASSWORD=任意の強いパスワード
CLIENT_ORIGIN=https://kyumei-kosyu.vercel.app
```

### 3.2 Vercel フロントに入れる値

- `VITE_API_BASE_URL`

例:

```env
VITE_API_BASE_URL=https://kyumei-kosyu-api.vercel.app
```

## 4. ローカルコードの事前修正

本番で Vercel フロントから別 Vercel API を呼べるように、フロントは相対パスではなく環境変数付きの API ベース URL を使う必要があります。

対象ファイル:

- [src/lib/api.ts](/C:/practice/KyumeiKosyu/src/lib/api.ts:1)

この修正がまだ入っていない場合は、先に反映してください。

必要な形は次です。

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
```

そして `fetch(path, ...)` を次に変えます。

```ts
fetch(`${API_BASE_URL}${path}`, ...)
```

もし未対応なら、このファイル修正を先に行ってからデプロイしてください。

## 5. Neon で PostgreSQL を確認する

今回は DB は Neon を使います。既存の Neon プロジェクトがある前提で進めます。

### 5.1 Neon にログイン

1. `https://neon.tech` を開く
2. ログインする

### 5.2 接続 URL を確認する

Neon の Project / Connection details から次を確認してください。

- Internal / External Database URL
- Host
- Port
- Database name
- Username
- Password

このプロジェクトでは基本的に `DATABASE_URL` が必要です。

控えた URL はあとで API 用 Vercel プロジェクトとローカル初期化に使います。

## 6. API 用の Vercel プロジェクトを作成する

### 6.1 新規 Vercel プロジェクトを作成

1. `https://vercel.com` を開く
2. `Add New...` から `Project` を選ぶ
3. この `KyumeiKosyu` リポジトリを選ぶ
4. API 用に別プロジェクトとして作成する

### 6.2 設定値を入力

まずは次の値で進めてください。

- Name: `kyumei-kosyu-api`
- Framework Preset: `Other`
- Root Directory: repo ルート
- Build Command: `npm install`
- Output Directory: 空欄
- Install Command: `npm install`

補足:

- サーバー本体は [server/src/index.ts](/C:/practice/KyumeiKosyu/server/src/index.ts:1)
- 実運用では Vercel 側で Express を API プロジェクトとしてデプロイする
- 必要に応じて API エントリポイントや `vercel.json` の整備を行う

### 6.3 環境変数を設定

API 用 Vercel プロジェクトの `Settings > Environment Variables` で次を追加してください。

```env
DATABASE_URL=Neon PostgreSQL の接続 URL
SESSION_SECRET=長いランダム文字列
ADMIN_USERNAME=admin
ADMIN_PASSWORD=任意の強いパスワード
CLIENT_ORIGIN=https://kyumei-kosyu.vercel.app
```

補足:

- `SESSION_SECRET` は必須です
- `CLIENT_ORIGIN` は CORS 許可元です
- `PORT` は Vercel では意識しません

### 6.4 デプロイ

1. 設定を保存する
2. Vercel 側で初回デプロイを実行する
3. デプロイ完了まで待つ

完了すると API の URL が払い出されます。

例:

```text
https://kyumei-kosyu-api.vercel.app
```

この URL をあとで Vercel に設定します。

## 7. データベースを初期化する

このリポジトリには `prisma/migrations` ディレクトリがまだ無いため、初回は `migrate deploy` ではなく `prisma db push` を使うのが安全です。

対象ファイル:

- [prisma/schema.prisma](/C:/practice/KyumeiKosyu/prisma/schema.prisma:1)
- [prisma/seed.ts](/C:/practice/KyumeiKosyu/prisma/seed.ts:1)

### 7.1 ローカル端末でプロジェクトに移動

PowerShell で次を実行します。

```powershell
cd C:\practice\KyumeiKosyu
```

### 7.2 環境変数を一時設定

次を自分の値に置き換えて実行します。

```powershell
$env:DATABASE_URL="Render PostgreSQL の接続 URL"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="ここに初期管理者パスワード"
```

### 7.3 テーブル作成

```powershell
npx prisma db push
```

期待する結果:

- PostgreSQL にテーブルが作成される
- Prisma schema と DB が同期される

### 7.4 初期データ投入

```powershell
npm run prisma:seed
```

この seed で入るもの:

- 管理者ユーザー
- 予約設定の初期値
- ホーム画面文言
- 講習種別

注意:

- `seed` は `SiteContent` を更新します
- 本番運用開始後に再実行する場合は上書き内容を理解してから行ってください

## 8. API 用 Vercel プロジェクトの動作確認

デプロイ後、ブラウザで次を開いてください。

```text
https://あなたのAPI用Vercel URL/api/health
```

期待するレスポンス:

```json
{"status":"ok"}
```

このエンドポイントは [server/src/index.ts](/C:/practice/KyumeiKosyu/server/src/index.ts:24) にあります。

もし開けない場合は Vercel のログで次を確認してください。

- Build が失敗していないか
- API エントリポイントが正しいか
- `DATABASE_URL` が入っているか
- `SESSION_SECRET` が入っているか

## 9. Vercel にフロントを設定する

### 9.1 Vercel プロジェクトを開く

1. `https://vercel.com` を開く
2. `KyumeiKosyu` のフロントプロジェクトを開く

### 9.2 環境変数を追加

Project Settings の `Environment Variables` で次を追加します。

```env
VITE_API_BASE_URL=https://あなたのAPI用Vercel URL
```

例:

```env
VITE_API_BASE_URL=https://kyumei-kosyu-api.vercel.app
```

注意:

- 末尾に `/api` は付けません
- コード側で `path` に `/api/...` が含まれます

### 9.3 再デプロイ

1. 環境変数を保存する
2. Vercel で再デプロイする

反映後、Vercel 上のフロントは Render API に向かって通信するようになります。

## 10. 本番での確認手順

### 10.1 画面を確認

次を開きます。

```text
https://kyumei-kosyu.vercel.app
```

### 10.2 予約画面から操作

1. 日付選択へ進む
2. 予約フォームを入力する
3. 確認画面まで進む
4. 予約送信を行う

### 10.3 ブラウザ開発者ツールで確認

Network タブで次を確認してください。

- リクエスト先が `https://kyumei-kosyu-api.vercel.app/api/...` になっている
- 404 ではなく 200 系または想定どおりのレスポンスになっている

### 10.4 管理画面確認

1. 管理ログイン画面を開く
2. `ADMIN_USERNAME` / `ADMIN_PASSWORD` でログインする
3. 予約一覧や設定画面が開くか確認する

## 11. トラブルシューティング

### 症状: `form:1 404`

原因候補:

- フロントがまだ相対 `/api/...` に投げている
- `VITE_API_BASE_URL` が未設定
- Vercel 再デプロイが未実施

確認箇所:

- [src/lib/api.ts](/C:/practice/KyumeiKosyu/src/lib/api.ts:1)
- Vercel の `VITE_API_BASE_URL`

### 症状: API が 500 になる

原因候補:

- `DATABASE_URL` が不正
- DB 初期化前
- `SESSION_SECRET` が未設定

確認箇所:

- Vercel API プロジェクトの環境変数
- `npx prisma db push` が成功しているか
- `npm run prisma:seed` が成功しているか

### 症状: 管理ログインできない

原因候補:

- `ADMIN_USERNAME` / `ADMIN_PASSWORD` と seed 実行時の値が違う
- seed を実行していない

対応:

1. 同じ環境変数を設定し直す
2. もう一度 `npm run prisma:seed` を実行する

### 症状: CORS エラー

原因候補:

- `CLIENT_ORIGIN` が違う

対応:

- API 用 Vercel プロジェクトの `CLIENT_ORIGIN` を次にする

```env
CLIENT_ORIGIN=https://kyumei-kosyu.vercel.app
```

## 12. 最終チェックリスト

- [ ] `src/lib/api.ts` が `VITE_API_BASE_URL` 対応になっている
- [ ] Neon の `DATABASE_URL` を確認した
- [ ] API 用 Vercel プロジェクトを作成した
- [ ] API 用 Vercel に環境変数を設定した
- [ ] `npx prisma db push` を実行した
- [ ] `npm run prisma:seed` を実行した
- [ ] `https://API Vercel URL/api/health` が成功した
- [ ] Vercel に `VITE_API_BASE_URL` を設定した
- [ ] Vercel を再デプロイした
- [ ] 本番画面から予約送信を確認した

## 13. 補足

将来的に改善するなら、次を検討できます。

- `api.ts` の API ベース URL 切り替えを明示化
- API 用 Vercel エントリポイントの明示化
- Prisma migration の整備
- seed の本番再実行リスク軽減
- Preview / Production で `CLIENT_ORIGIN` を分けられるようにする
