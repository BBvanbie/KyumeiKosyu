import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { SiteContent } from '../lib/types'

const fallbackContent = {
  heroTitle: '予約したい講習日を選び、そのまま予約手続きへ進めます。',
  heroDescription:
    '救命講習の団体予約をオンラインで受け付けています。希望日を選択し、必要事項を入力して送信してください。',
  guideTitle: 'ご利用案内',
  guideBody:
    '予約送信後、消防署からのお電話で受付確定となります。英語版講習や予約不可日がある場合は、画面内の案内をご確認ください。',
}

export function HomePage() {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    void api.getHomeSiteContent().then(setContent).catch(() => setContent(null))
  }, [])

  const view = content ?? { id: 'home', updatedAt: '', ...fallbackContent }

  return (
    <main className="page-shell">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">救命講習予約システム</p>
          <h1>{view.heroTitle}</h1>
          <p className="lead">{view.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button button-primary cta-animated" to="/reserve">
              予約をはじめる
            </Link>
            <Link className="button button-secondary" to="/admin/login">
              管理者ログイン
            </Link>
          </div>
        </div>

        <aside className="home-hero__panel">
          <p className="card-kicker">予約の流れ</p>
          <ol className="home-step-list">
            <li>希望日を選ぶ</li>
            <li>予約情報を入力する</li>
            <li>電話で受付確定する</li>
          </ol>
        </aside>
      </section>

      <section className="content-grid">
        <article className="info-card">
          <p className="card-kicker">ご案内</p>
          <h2>{view.guideTitle}</h2>
          <p>{view.guideBody}</p>
        </article>

        <article className="info-card">
          <p className="card-kicker">注意事項</p>
          <h2>予約前にご確認ください</h2>
          <ul className="home-note-list">
            <li>予約送信後、消防署からのお電話で受付確定となります。</li>
            <li>英語版講習は通訳手配が必要です。状況によっては電話受付となります。</li>
            <li>予約不可日や受付停止日はカレンダー上で選択できません。</li>
          </ul>
        </article>
      </section>
    </main>
  )
}
