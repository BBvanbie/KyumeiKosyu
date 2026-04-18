import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReservationStatusBadge } from '../components/booking/ReservationStatusBadge'
import { api } from '../lib/api'
import type { ReservationLookupResult } from '../lib/types'

export function ReservationLookupResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as
    | {
        reservationNumber?: string
        confirmationCode?: string
        reservation?: ReservationLookupResult
      }
    | undefined
  const [reservation, setReservation] = useState<ReservationLookupResult | null>(
    state?.reservation ?? null
  )
  const [fireStationPhone, setFireStationPhone] = useState('')
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (!state?.reservationNumber || !state.confirmationCode) {
      return
    }

    if (state.reservation) return

    void api
      .lookupReservation({
        reservationNumber: state.reservationNumber,
        confirmationCode: state.confirmationCode,
      })
      .then(setReservation)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : '予約の取得に失敗しました')
      })
  }, [state])

  if (!state?.reservationNumber || !state.confirmationCode) {
    return (
      <main className="page-shell">
        <div className="status-panel">
          確認情報がありません。<Link to="/reservation/lookup">予約確認ページへ戻る</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="form-shell">
        <div className="section-head">
          <div>
            <p className="card-kicker">予約確認</p>
            <h1>予約内容</h1>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        {reservation ? (
          <section className="summary-card">
            <dl className="summary-grid">
              <div>
                <dt>予約番号</dt>
                <dd>{reservation.reservationNumber}</dd>
              </div>
              <div>
                <dt>状態</dt>
                <dd>
                  <ReservationStatusBadge status={reservation.status} />
                </dd>
              </div>
              <div>
                <dt>確定日時</dt>
                <dd>{reservation.confirmedAt ? formatDateTime(reservation.confirmedAt) : '-'}</dd>
              </div>
              <div>
                <dt>希望日</dt>
                <dd>{reservation.preferredDate.slice(0, 10)}</dd>
              </div>
              <div>
                <dt>氏名</dt>
                <dd>{reservation.fullName}</dd>
              </div>
              <div>
                <dt>電話番号</dt>
                <dd>{reservation.phone}</dd>
              </div>
              <div>
                <dt>団体名</dt>
                <dd>{reservation.organizationName || '-'}</dd>
              </div>
            </dl>

            <div className="summary-items">
              <h2>受講内容</h2>
              <div className="summary-items__list">
                {reservation.items.map((item) => (
                  <div key={item.id} className="summary-items__row">
                    <span>{item.reservationType.name}</span>
                    <span>{item.participantCount}名</span>
                  </div>
                ))}
              </div>
            </div>

            {reservation.status === 'confirmed' ? (
              <p className="success-text">消防署より電話連絡済みです。予約は確定しています。</p>
            ) : null}

            {reservation.status !== 'cancelled' ? (
              <div className="form-actions">
                <button className="button button-secondary" onClick={() => navigate('/')} type="button">
                  ホームへ戻る
                </button>
                <button
                  className="button button-primary"
                  onClick={async () => {
                    setError('')

                    try {
                      const result = await api.cancelReservation({
                        reservationNumber: state.reservationNumber!,
                        confirmationCode: state.confirmationCode!,
                      })
                      setReservation(result.reservation)
                      setFireStationPhone(result.fireStationPhone)
                      setShowCancelModal(true)
                    } catch (cancelError) {
                      setError(cancelError instanceof Error ? cancelError.message : 'キャンセルに失敗しました')
                    }
                  }}
                  type="button"
                >
                  予約をキャンセルする
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </section>

      {showCancelModal ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <p className="card-kicker">キャンセル受付</p>
            <h2>キャンセルを受け付けました</h2>
            <p>必ず消防署へ電話連絡もしてください。</p>
            <p>消防署電話番号: {fireStationPhone || '未設定'}</p>
            <button
              className="button button-primary"
              onClick={() => setShowCancelModal(false)}
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP')
}
