import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { Reservation, ReservationStatus } from '../../lib/types'

export function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState('')
  const [regeneratedCode, setRegeneratedCode] = useState('')

  const loadReservations = async () => {
    try {
      setReservations(await api.getReservations())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '予約一覧の取得に失敗しました')
    }
  }

  useEffect(() => {
    void api
      .getReservations()
      .then(setReservations)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : '予約一覧の取得に失敗しました')
      })
  }, [])

  const updateStatus = async (id: string, status: ReservationStatus) => {
    await api.updateReservationStatus(id, status)
    await loadReservations()
  }

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">予約管理</p>
          <h1>予約一覧</h1>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>予約番号</th>
              <th>希望日</th>
              <th>氏名</th>
              <th>電話番号</th>
              <th>受講種別</th>
              <th>状態</th>
              <th>確定日時</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.reservationNumber}</td>
                <td>{reservation.preferredDate.slice(0, 10)}</td>
                <td>{reservation.fullName}</td>
                <td>{reservation.phone}</td>
                <td>
                  <div className="reservation-items-cell">
                    {reservation.items.map((item) => (
                      <span key={item.id}>
                        {item.reservationType.name} / {item.participantCount}名
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${reservation.status}`}>
                    {reservation.status}
                  </span>
                </td>
                <td>{reservation.confirmedAt ? new Date(reservation.confirmedAt).toLocaleString('ja-JP') : '-'}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => void updateStatus(reservation.id, 'confirmed')} type="button">
                      確定
                    </button>
                    <button onClick={() => void updateStatus(reservation.id, 'cancelled')} type="button">
                      取消
                    </button>
                    <button
                      onClick={async () => {
                        const result = await api.regenerateConfirmationCode(reservation.id)
                        setRegeneratedCode(
                          `${reservation.reservationNumber} の新しい確認キー: ${result.confirmationCode}`
                        )
                      }}
                      type="button"
                    >
                      確認キー再発行
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {regeneratedCode ? <p className="success-text">{regeneratedCode}</p> : null}
    </section>
  )
}
