import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

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
        </div>

        <section className="form-card">
          <form
            className="booking-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setError('')

              try {
                await api.lookupReservation({ reservationNumber, confirmationCode })
                navigate('/reservation/lookup/result', {
                  state: { reservationNumber, confirmationCode },
                })
              } catch (lookupError) {
                setError(lookupError instanceof Error ? lookupError.message : '予約確認に失敗しました')
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
