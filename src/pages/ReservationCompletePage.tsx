import { Link, useLocation } from 'react-router-dom'

export function ReservationCompletePage() {
  const location = useLocation()
  const state = location.state as
    | { reservationNumber?: string; confirmationCode?: string }
    | undefined

  if (!state?.reservationNumber || !state.confirmationCode) {
    return (
      <main className="page-shell">
        <div className="status-panel">
          完了情報がありません。<Link to="/">ホームへ戻る</Link> または{' '}
          <Link to="/reservation/lookup">予約を確認する</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="form-shell">
        <div className="section-head">
          <div>
            <p className="card-kicker">送信完了</p>
            <h1>予約を受け付けました</h1>
          </div>
        </div>

        <section className="summary-card">
          <p className="lead">
            予約完了は消防署からのお電話で確定となります。担当者からの連絡をお待ちください。
          </p>

          <div className="summary-items">
            <h2>控えておく情報</h2>
            <div className="summary-items__list">
              <div className="summary-items__row">
                <span>予約番号</span>
                <strong>{state.reservationNumber}</strong>
              </div>
              <div className="summary-items__row">
                <span>確認キー</span>
                <strong>{state.confirmationCode}</strong>
              </div>
            </div>
          </div>

          <p className="lead lead--small">
            予約の状態確認やキャンセルには、予約番号と確認キーが必要です。
          </p>

          <div className="form-actions">
            <Link className="button button-secondary" to="/reservation/lookup">
              予約を確認する
            </Link>
            <Link className="button button-primary" to="/">
              ホームへ戻る
            </Link>
          </div>
        </section>
      </section>
    </main>
  )
}
