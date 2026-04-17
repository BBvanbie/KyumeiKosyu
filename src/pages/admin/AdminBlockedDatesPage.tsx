import { useEffect, useState } from 'react'
import { CalendarPicker } from '../../components/booking/CalendarPicker'
import { api } from '../../lib/api'
import type { BlockedDate } from '../../lib/types'

const blockedDateReasonOptions = ['署行事', '指導員不足', 'その他'] as const

export function AdminBlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [singleReason, setSingleReason] =
    useState<(typeof blockedDateReasonOptions)[number]>('署行事')
  const [rangeStartDate, setRangeStartDate] = useState('')
  const [rangeEndDate, setRangeEndDate] = useState('')
  const [rangeReason, setRangeReason] =
    useState<(typeof blockedDateReasonOptions)[number]>('署行事')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadBlockedDates = async () => {
    try {
      setBlockedDates(await api.getBlockedDates())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '予約不可日の取得に失敗しました')
    }
  }

  useEffect(() => {
    void api
      .getBlockedDates()
      .then(setBlockedDates)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : '予約不可日の取得に失敗しました')
      })
  }, [])

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">日程管理</p>
          <h1>予約不可日の登録</h1>
        </div>
      </div>

      <div className="admin-card-grid">
        <section className="form-card form-card--stacked">
          <div className="section-head">
            <div>
              <p className="card-kicker">カレンダー登録</p>
              <h2>日付をクリックして個別登録</h2>
            </div>
          </div>

          <CalendarPicker
            blockedDates={blockedDates.map((entry) => entry.date)}
            disabledBlockedDates={false}
            label="予約不可日登録カレンダー"
            onSelect={(date) => {
              setSelectedDate(date)
              setSingleReason('署行事')
              setIsModalOpen(true)
            }}
            selectedDate={selectedDate}
          />
        </section>

        <section className="form-card">
          <p className="card-kicker">期間指定</p>
          <h2>範囲をまとめて予約不可にする</h2>
          <form
            className="booking-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setError('')
              setSuccessMessage('')

              try {
                await api.createBlockedDateRange({
                  startDate: rangeStartDate,
                  endDate: rangeEndDate,
                  reason: rangeReason,
                })
                setRangeStartDate('')
                setRangeEndDate('')
                setRangeReason('署行事')
                setSuccessMessage('期間指定の予約不可日を登録しました')
                await loadBlockedDates()
              } catch (submitError) {
                setError(
                  submitError instanceof Error
                    ? submitError.message
                    : '期間指定の登録に失敗しました'
                )
              }
            }}
          >
            <label>
              <span>開始日</span>
              <input
                required
                type="date"
                value={rangeStartDate}
                onChange={(event) => setRangeStartDate(event.target.value)}
              />
            </label>
            <label>
              <span>終了日</span>
              <input
                required
                type="date"
                value={rangeEndDate}
                onChange={(event) => setRangeEndDate(event.target.value)}
              />
            </label>
            <label className="form-grid__wide">
              <span>理由</span>
              <select
                value={rangeReason}
                onChange={(event) =>
                  setRangeReason(event.target.value as (typeof blockedDateReasonOptions)[number])
                }
              >
                {blockedDateReasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {successMessage ? <p className="success-text">{successMessage}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
            <button className="button button-primary" type="submit">
              一括登録する
            </button>
          </form>
        </section>

        <section className="info-card admin-card-grid__full">
          <p className="card-kicker">登録状況</p>
          <h2>登録済み一覧</h2>
          <ul className="stack-list">
            {blockedDates.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.date.slice(0, 10)}</strong>
                <span>{entry.reason || '理由未入力'}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <p className="card-kicker">個別登録</p>
            <h2>{selectedDate} を予約不可にする</h2>
            <label className="booking-form">
              <span>理由</span>
              <select
                value={singleReason}
                onChange={(event) =>
                  setSingleReason(event.target.value as (typeof blockedDateReasonOptions)[number])
                }
              >
                {blockedDateReasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <div className="form-actions">
              <button
                className="button button-secondary"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                閉じる
              </button>
              <button
                className="button button-primary"
                onClick={async () => {
                  setError('')
                  setSuccessMessage('')

                  try {
                    await api.createBlockedDate({ date: selectedDate, reason: singleReason })
                    setIsModalOpen(false)
                    setSelectedDate('')
                    setSingleReason('署行事')
                    setSuccessMessage('予約不可日を登録しました')
                    await loadBlockedDates()
                  } catch (submitError) {
                    setError(
                      submitError instanceof Error
                        ? submitError.message
                        : '予約不可日の登録に失敗しました'
                    )
                  }
                }}
                type="button"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
