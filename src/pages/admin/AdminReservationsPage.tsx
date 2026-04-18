import { useEffect, useState } from 'react'
import { ReservationStatusBadge } from '../../components/booking/ReservationStatusBadge'
import { api } from '../../lib/api'
import type { AdditionalTextbookKey, Reservation, ReservationStatus } from '../../lib/types'

const additionalTextbookKeys: AdditionalTextbookKey[] = [
  'basicInitial',
  'basicRenewal',
  'basicEnglish',
  'advancedInitial',
  'advancedRenewal',
]

const additionalTextbookLabels: Record<AdditionalTextbookKey, string> = {
  basicInitial: '追加テキスト_普通_新規',
  basicRenewal: '追加テキスト_普通_再講習',
  basicEnglish: '追加テキスト_普通_英語版',
  advancedInitial: '追加テキスト_上級_新規',
  advancedRenewal: '追加テキスト_上級_再講習',
}

export function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState('')
  const [regeneratedCode, setRegeneratedCode] = useState('')
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null)

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
    setError('')

    try {
      const updatedReservation = await api.updateReservationStatus(id, status)
      if (status === 'confirmed') {
        setConfirmedReservation(updatedReservation)
      }
      await loadReservations()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : '予約状態の更新に失敗しました')
    }
  }

  const downloadCsv = () => {
    const targetReservations = selectedMonth
      ? reservations.filter((reservation) =>
          reservation.preferredDate.slice(0, 7) === selectedMonth
        )
      : reservations

    const header = [
      '予約番号',
      '状態',
      '確定日時',
      '希望日',
      '開始希望時間',
      '氏名',
      '住所',
      '電話番号',
      'メールアドレス',
      '団体名',
      '実施場所住所',
      '受講対象者',
      '通訳手配',
      '日本語テキスト必要部数',
      '英語版テキスト必要部数',
      '追加テキスト購入',
      ...additionalTextbookKeys.map((key) => additionalTextbookLabels[key]),
      '備考',
      '受講種別一覧',
      '作成日時',
    ]

    const rows = targetReservations.map((reservation) => [
      reservation.reservationNumber,
      formatReservationStatus(reservation.status),
      reservation.confirmedAt ? new Date(reservation.confirmedAt).toLocaleString('ja-JP') : '',
      reservation.preferredDate.slice(0, 10),
      reservation.preferredStartTime ?? '',
      reservation.fullName,
      reservation.address ?? '',
      reservation.phone,
      reservation.email ?? '',
      reservation.organizationName ?? '',
      reservation.venueAddress ?? '',
      reservation.targetAudience ?? '',
      formatInterpreterAvailability(reservation.interpreterAvailable),
      reservation.japaneseTextbookCount?.toString() ?? '',
      reservation.englishTextbookCount?.toString() ?? '',
      reservation.wantsAdditionalTextbooks ? 'あり' : 'なし',
      ...additionalTextbookKeys.map(
        (key) => reservation.additionalTextbookCounts?.[key]?.toString() ?? '0'
      ),
      reservation.notes ?? '',
      reservation.items
        .map((item) => `${item.reservationType.name}:${item.participantCount}名`)
        .join(' / '),
      new Date(reservation.createdAt).toLocaleString('ja-JP'),
    ])

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">予約管理</p>
          <h1>予約一覧</h1>
        </div>
        <div className="export-panel">
          <div className="export-panel__copy">
            <p className="card-kicker">CSVエクスポート</p>
            <p>希望日を基準に対象年月を絞って出力できます。</p>
          </div>
          <label className="export-panel__field">
            <span>CSV対象年月</span>
            <input
              className="export-panel__input"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
          </label>
          <button className="button button-secondary" onClick={downloadCsv} type="button">
            CSV出力
          </button>
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
                  <ReservationStatusBadge status={reservation.status} />
                </td>
                <td>{reservation.confirmedAt ? new Date(reservation.confirmedAt).toLocaleString('ja-JP') : '-'}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => setDetailReservation(reservation)} type="button">
                      詳細
                    </button>
                    <button onClick={() => void updateStatus(reservation.id, 'confirmed')} type="button">
                      確定
                    </button>
                    <button onClick={() => void updateStatus(reservation.id, 'cancelled')} type="button">
                      取消
                    </button>
                    <button
                      onClick={async () => {
                        setError('')
                        setRegeneratedCode('')

                        try {
                          const result = await api.regenerateConfirmationCode(reservation.id)
                          setRegeneratedCode(
                            `${reservation.reservationNumber} の新しい確認キー: ${result.confirmationCode}`
                          )
                        } catch (regenerateError) {
                          setError(
                            regenerateError instanceof Error
                              ? regenerateError.message
                              : '確認キーの再発行に失敗しました'
                          )
                        }
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

      {detailReservation ? (
        <div
          className="modal-backdrop"
          onClick={() => setDetailReservation(null)}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="modal-card modal-card--wide"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <p className="card-kicker">予約詳細</p>
            <h2>{detailReservation.reservationNumber}</h2>
            <div className="summary-items">
              <div className="summary-items__row">
                <span>状態</span>
                <ReservationStatusBadge status={detailReservation.status} />
              </div>
              <div className="summary-items__row">
                <span>希望日</span>
                <strong>{detailReservation.preferredDate.slice(0, 10)}</strong>
              </div>
              <div className="summary-items__row">
                <span>開始希望時間</span>
                <strong>{detailReservation.preferredStartTime ?? '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>氏名</span>
                <strong>{detailReservation.fullName}</strong>
              </div>
              <div className="summary-items__row">
                <span>住所</span>
                <strong>{detailReservation.address || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>電話番号</span>
                <strong>{detailReservation.phone}</strong>
              </div>
              <div className="summary-items__row">
                <span>メールアドレス</span>
                <strong>{detailReservation.email || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>団体名</span>
                <strong>{detailReservation.organizationName || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>実施場所住所</span>
                <strong>{detailReservation.venueAddress || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>受講対象者</span>
                <strong>{detailReservation.targetAudience || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>通訳手配</span>
                <strong>{formatInterpreterAvailability(detailReservation.interpreterAvailable) || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>日本語テキスト必要部数</span>
                <strong>{detailReservation.japaneseTextbookCount ?? '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>英語版テキスト必要部数</span>
                <strong>{detailReservation.englishTextbookCount ?? '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>追加テキスト購入</span>
                <strong>{detailReservation.wantsAdditionalTextbooks ? 'あり' : 'なし'}</strong>
              </div>
              {additionalTextbookKeys.map((key) => (
                <div key={key} className="summary-items__row">
                  <span>{additionalTextbookLabels[key]}</span>
                  <strong>{detailReservation.additionalTextbookCounts?.[key] ?? 0}</strong>
                </div>
              ))}
              <div className="summary-items__row">
                <span>備考</span>
                <strong>{detailReservation.notes || '-'}</strong>
              </div>
              <div className="summary-items__row">
                <span>受講種別一覧</span>
                <strong>
                  {detailReservation.items
                    .map((item) => `${item.reservationType.name} / ${item.participantCount}名`)
                    .join(' / ')}
                </strong>
              </div>
              <div className="summary-items__row">
                <span>作成日時</span>
                <strong>{new Date(detailReservation.createdAt).toLocaleString('ja-JP')}</strong>
              </div>
              <div className="summary-items__row">
                <span>確定日時</span>
                <strong>
                  {detailReservation.confirmedAt
                    ? new Date(detailReservation.confirmedAt).toLocaleString('ja-JP')
                    : '-'}
                </strong>
              </div>
            </div>
            <button
              className="button button-primary"
              onClick={() => setDetailReservation(null)}
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}

      {confirmedReservation ? (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmedReservation(null)}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <p className="card-kicker">予約確定</p>
            <h2>予約を確定しました</h2>
            <p>電話で確定した旨を連絡してください。</p>
            <div className="summary-items">
              <div className="summary-items__row">
                <span>氏名</span>
                <strong>{confirmedReservation.fullName}</strong>
              </div>
              <div className="summary-items__row">
                <span>電話番号</span>
                <strong>{confirmedReservation.phone}</strong>
              </div>
            </div>
            <button
              className="button button-primary"
              onClick={() => setConfirmedReservation(null)}
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function formatReservationStatus(status: ReservationStatus) {
  if (status === 'pending') return '受付中'
  if (status === 'confirmed') return '確定'
  return 'キャンセル'
}

function formatInterpreterAvailability(value: Reservation['interpreterAvailable']) {
  if (value === true) return '可能'
  if (value === false) return '不可'
  return ''
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}
