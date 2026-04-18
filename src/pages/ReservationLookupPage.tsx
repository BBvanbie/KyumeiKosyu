import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { ReservationLookupResult } from '../lib/types'

export function ReservationLookupPage() {
  const navigate = useNavigate()
  const [reservationNumber, setReservationNumber] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')

  return (
    <main className="page-shell">
      <section className="form-shell">
        <div className="section-head">
          <div>
            <p className="card-kicker">予約確認</p>
            <h1>予約内容の確認</h1>
          </div>
          <p className="lead lead--small">
            予約番号と確認キーを入力すると、予約の状態を確認できます。どちらかがわからない場合は消防署へ電話連絡してください。
          </p>
        </div>

        <section className="form-card">
          <form
            className="booking-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setError('')

              try {
                const reservation = await api.lookupReservation({ reservationNumber, confirmationCode })
                const nextState: LookupNavigationState = {
                  reservationNumber,
                  confirmationCode,
                  reservation,
                }
                navigate('/reservation/lookup/result', {
                  state: nextState,
                })
              } catch (lookupError) {
                const fallbackMessage =
                  '検索結果にありません。予約番号または確認キーがわからない場合は消防署へ電話連絡してください。'

                setError(lookupError instanceof Error ? fallbackMessage : fallbackMessage)
              }
            }}
          >
            <label>
              <span>予約番号</span>
              <input
                required
                value={reservationNumber}
                onChange={(event) => setReservationNumber(event.target.value)}
              />
            </label>
            <label>
              <span>確認キー</span>
              <input
                required
                value={confirmationCode}
                onChange={(event) => setConfirmationCode(event.target.value)}
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <button className="button button-primary" type="submit">
              予約内容を確認する
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

type LookupNavigationState = {
  reservationNumber: string
  confirmationCode: string
  reservation: ReservationLookupResult
}
