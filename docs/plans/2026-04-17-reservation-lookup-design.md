# 予約確認ポータル設計

## 目的

利用者が会員登録なしで自分の予約を確認・キャンセルできるようにする。管理者側ではキャンセル履歴と通知を必ず確認できるようにする。

## 利用者向け

- 予約完了時に `予約番号` と `確認キー` を発行する
- 利用者は `予約番号 + 確認キー` で予約内容を確認できる
- 利用者は同じ画面から予約をキャンセルできる
- キャンセル完了時はモーダルで消防署の電話番号を表示し、必ず電話連絡するよう案内する

## 管理者向け

- キャンセルは予約状態変更だけで終わらせず、履歴を必ず残す
- 管理ホームに通知を表示する
- 予約一覧からキャンセル状態も確認できる

## データ構造

- `Reservation`
  - `reservationNumber`
  - `confirmationCodeHash`
- `CancellationLog`
  - `reservationId`
  - `cancelledAt`
  - `cancelledBy`
  - `note`
- `AdminNotification`
  - `type`
  - `title`
  - `body`
  - `isRead`
- `SiteContent`
  - `fireStationPhone`

## セキュリティ

- 確認キーは平文保存しない
- サーバーでは hash 比較を行う
- 予約確認レスポンスでは確認キーを返さない
