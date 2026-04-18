import type { ReservationStatus } from '../../lib/types'

const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: '受付中',
  confirmed: '確定',
  cancelled: 'キャンセル',
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      {reservationStatusLabels[status]}
    </span>
  )
}
