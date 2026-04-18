# Vercel Neon Deployment Design

## Goal

`KyumeiKosyu` を `Vercel + Neon` で完結させる。フロントは既存の Vite 構成を維持し、API は別 Vercel プロジェクトとして運用する。

## Context

- 現在のフロントは React + Vite
- 現在の API は Express + Prisma + PostgreSQL
- 既存ドキュメントは `Render` 前提だった
- 参照例の `medical-support-apps` は Next.js だが、本件では Next.js への移行は不要

## Options

### Option 1: Vercel 2-project + Neon

- フロントを既存の Vercel プロジェクトで継続
- API を別の Vercel プロジェクトとしてデプロイ
- DB は Neon を使う

Pros:

- 既存の `server/src/routes/*` を活かせる
- `Render` を完全に外せる
- フロントと API の責務分離が明確
- Next.js への移行が不要

Cons:

- Vercel プロジェクトが 2 つになる
- フロントから API へは別オリジン通信になるため `CLIENT_ORIGIN` 管理が必要

### Option 2: 1 Vercel project with local api routing

- Vite プロジェクト直下に `api/` を作る
- Vercel Functions として API を同居させる

Pros:

- プロジェクト数は 1 つ
- フロントと API を同一オリジンにできる

Cons:

- 今の Express サーバー構成を Vercel 向けに詰め替える必要がある
- ルーティングとビルド調整が増える
- 今回の目的に対して変更量が大きい

### Option 3: Full Next.js migration

- `medical-support-apps` のように `app/api/**/route.ts` へ全面移行する

Pros:

- Vercel との相性は最も良い
- 構成を一本化しやすい

Cons:

- 変更量が大きすぎる
- 現在の依頼範囲を超える

## Recommendation

`Option 1: Vercel 2-project + Neon` を採用する。

理由:

- ユーザーの目的は `Render` をやめて `Vercel + Neon` で完結させること
- Next.js への移行は不要
- 既存 Express API を残したまま最小変更で進められる

## Architecture

### Frontend

- Public URL: `https://kyumei-kosyu.vercel.app`
- 実装: Vite build をそのまま Vercel にデプロイ
- API 呼び先: `VITE_API_BASE_URL`

### API

- Public URL 例: `https://kyumei-kosyu-api.vercel.app`
- 実装: Express を別 Vercel プロジェクトとしてデプロイ
- DB 接続: Neon `DATABASE_URL`
- CORS 許可元: `CLIENT_ORIGIN=https://kyumei-kosyu.vercel.app`

### Database

- Neon PostgreSQL
- Prisma schema は現状維持
- 初回は `prisma db push` と `prisma:seed` で投入

## Data Flow

1. ユーザーがフロント Vercel にアクセスする
2. フロントが `VITE_API_BASE_URL + /api/...` に送信する
3. API Vercel が Neon に接続して処理する
4. レスポンスをフロントへ返す

## Error Handling

- `form:1 404`
  フロントの API 送信先が API Vercel URL を向いていない
- `500`
  `DATABASE_URL` / `SESSION_SECRET` / DB 初期化不足を疑う
- `CORS`
  `CLIENT_ORIGIN` の設定ミスを疑う

## Testing

- API health endpoint を確認する
- 本番フロントから予約送信まで確認する
- 管理画面ログインも確認する

