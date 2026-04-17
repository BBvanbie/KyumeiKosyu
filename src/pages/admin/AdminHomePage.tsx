import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { AdminNotification } from '../../lib/types'

export function AdminHomePage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  useEffect(() => {
    void api.getAdminNotifications().then(setNotifications).catch(() => setNotifications([]))
  }, [])

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">管理ホーム</p>
          <h1>管理者ホーム</h1>
        </div>
      </div>

      <div className="admin-card-grid">
        <article className="info-card">
          <p className="card-kicker">予約管理</p>
          <h2>現在の予約状況を確認</h2>
          <p>利用者から届いた予約を一覧で確認し、後で状態更新へつなげます。</p>
        </article>
        <article className="info-card">
          <p className="card-kicker">日程管理</p>
          <h2>予約不可日を登録</h2>
          <p>休止日や受付停止日を登録し、利用者カレンダーに即時反映します。</p>
        </article>
        <article className="info-card admin-card-grid__full">
          <p className="card-kicker">通知</p>
          <h2>最新の通知</h2>
          <ul className="stack-list">
            {notifications.length ? (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <strong>{notification.title}</strong>
                  <span>{notification.body}</span>
                </li>
              ))
            ) : (
              <li>
                <strong>通知はありません</strong>
              </li>
            )}
          </ul>
        </article>
      </div>
    </section>
  )
}
