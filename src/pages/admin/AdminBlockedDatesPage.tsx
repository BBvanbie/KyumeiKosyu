import { useEffect, useMemo, useState } from 'react'
import { CalendarPicker } from '../../components/booking/CalendarPicker'
import { api } from '../../lib/api'
import type { BlockedDate } from '../../lib/types'

const blockedDateReasonOptions = ['署行事', '指導員不足', 'その他'] as const
type BlockedDateReason = (typeof blockedDateReasonOptions)[number]

export function AdminBlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [listSelectedDates, setListSelectedDates] = useState<string[]>([])
  const [singleReason, setSingleReason] = useState<BlockedDateReason>('署行事')
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'remove'>('create')

  const blockedDateSet = useMemo(
    () => new Set(blockedDates.map((entry) => entry.date.slice(0, 10))),
    [blockedDates]
  )
  const blockedSelection = selectedDates.filter((date) => blockedDateSet.has(date))
  const availableSelection = selectedDates.filter((date) => !blockedDateSet.has(date))
  const hasMixedSelection = blockedSelection.length > 0 && availableSelection.length > 0
  const allBlockedDates = blockedDates.map((entry) => entry.date.slice(0, 10))

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

  const resetSelection = () => {
    setSelectedDate('')
    setSelectedDates([])
    setIsMultiSelectMode(false)
  }

  const toggleListSelection = (date: string) => {
    setListSelectedDates((current) =>
      current.includes(date) ? current.filter((entry) => entry !== date) : [...current, date].sort()
    )
  }

  const openCreateModal = (dates: string[]) => {
    setError('')
    setSingleReason('署行事')
    setModalMode('create')
    setSelectedDate(dates[0] ?? '')
    setSelectedDates(dates)
    setIsModalOpen(true)
  }

  const openRemoveModal = (dates: string[]) => {
    setError('')
    setModalMode('remove')
    setSelectedDate(dates[0] ?? '')
    setSelectedDates(dates)
    setIsModalOpen(true)
  }

  const handleCalendarSelect = (dates: string[], options: { keepMultiSelect: boolean }) => {
    setError('')
    setSuccessMessage('')
    setSelectedDates(dates)
    setSelectedDate(dates[dates.length - 1] ?? '')
    setIsMultiSelectMode(options.keepMultiSelect)

    if (dates.length === 0 || options.keepMultiSelect) {
      return
    }

    if (blockedDateSet.has(dates[0])) {
      openRemoveModal(dates)
      return
    }

    openCreateModal(dates)
  }

  const handlePrimaryAction = () => {
    if (selectedDates.length === 0 || hasMixedSelection) {
      return
    }

    if (availableSelection.length > 0) {
      openCreateModal(availableSelection)
      return
    }

    openRemoveModal(blockedSelection)
  }

  const handleSubmitSelection = async () => {
    setError('')
    setSuccessMessage('')

    try {
      if (modalMode === 'create') {
        await Promise.all(
          selectedDates.map((date) => api.createBlockedDate({ date, reason: singleReason }))
        )
        setSuccessMessage(
          selectedDates.length === 1
            ? '予約不可日を登録しました'
            : `${selectedDates.length}日を予約不可に登録しました`
        )
      } else {
        const result = await api.deleteBlockedDates({ dates: selectedDates })
        setSuccessMessage(
          result.deletedCount === 1
            ? '予約不可日を解除しました'
            : `${result.deletedCount}日を予約可能に戻しました`
        )
      }

      setIsModalOpen(false)
      setSingleReason('署行事')
      resetSelection()
      setListSelectedDates([])
      await loadBlockedDates()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : modalMode === 'create'
            ? '予約不可日の登録に失敗しました'
            : '予約不可日の解除に失敗しました'
      )
    }
  }

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">日程管理</p>
          <h1>予約不可日の登録</h1>
        </div>
      </div>

      <div className="admin-card-grid admin-card-grid--calendar">
        <section className="form-card form-card--stacked">
          <div className="section-head">
            <div>
              <p className="card-kicker">カレンダー登録</p>
              <h2>日付を選択して予約不可を登録・解除</h2>
              <p className="section-description">
                通常クリックで単日操作、`Ctrl` を押しながらのクリックまたは複数選択ボタンで複数日を選択できます。
              </p>
            </div>
            <div className="calendar-selection-actions">
              <button
                className={`button ${isMultiSelectMode ? 'button-primary' : 'button-secondary'}`}
                onClick={() => {
                  setError('')
                  setSuccessMessage('')
                  setIsMultiSelectMode((current) => !current)
                }}
                type="button"
              >
                {isMultiSelectMode ? '複数選択中' : '複数選択'}
              </button>
              <button
                className="button button-primary"
                disabled={selectedDates.length === 0 || hasMixedSelection}
                onClick={handlePrimaryAction}
                type="button"
              >
                {blockedSelection.length > 0 && availableSelection.length === 0
                  ? '解除する'
                  : '登録する'}
              </button>
            </div>
          </div>

          <div className="calendar-selection-summary">
            <p className="calendar-selection-summary__text">
              {selectedDates.length === 0 ? '日付を選択してください' : `${selectedDates.length}日を選択中`}
            </p>
            {selectedDates.length > 0 ? (
              <button
                className="button button-ghost"
                onClick={() => {
                  setError('')
                  setSuccessMessage('')
                  resetSelection()
                }}
                type="button"
              >
                選択をクリア
              </button>
            ) : null}
          </div>

          {hasMixedSelection ? (
            <p className="error-text">
              登録対象と解除対象が混在しています。どちらか片方の選択に揃えてください。
            </p>
          ) : null}

          <CalendarPicker
            blockedDates={blockedDates.map((entry) => entry.date)}
            disabledBlockedDates={false}
            disablePastDates={false}
            label="予約不可日登録カレンダー"
            multiSelectEnabled={isMultiSelectMode}
            onSelect={setSelectedDate}
            onSelectDates={handleCalendarSelect}
            selectedDate={selectedDate}
            selectedDates={selectedDates}
          />
        </section>

        <section className="info-card admin-card-grid__full">
          <p className="card-kicker">登録状況</p>
          <h2>登録済み一覧</h2>
          <div className="blocked-list-actions">
            <p className="calendar-selection-summary__text">
              {listSelectedDates.length === 0
                ? '解除したい日付を選択してください'
                : `${listSelectedDates.length}日を選択中`}
            </p>
            <div className="blocked-list-actions__buttons">
              <button
                className="button button-ghost"
                disabled={blockedDates.length === 0}
                onClick={() =>
                  setListSelectedDates((current) =>
                    current.length === allBlockedDates.length ? [] : allBlockedDates
                  )
                }
                type="button"
              >
                {listSelectedDates.length === allBlockedDates.length ? '全解除' : 'すべて選択'}
              </button>
              <button
                className="button button-secondary"
                disabled={listSelectedDates.length === 0}
                onClick={() => openRemoveModal(listSelectedDates)}
                type="button"
              >
                選択日を解除する
              </button>
            </div>
          </div>
          {successMessage ? <p className="success-text">{successMessage}</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          <ul className="stack-list">
            {blockedDates.map((entry) => (
              <li key={entry.id}>
                <div className="stack-list__row">
                  <label className="stack-list__checkbox">
                    <input
                      checked={listSelectedDates.includes(entry.date.slice(0, 10))}
                      onChange={() => toggleListSelection(entry.date.slice(0, 10))}
                      type="checkbox"
                    />
                    <span className="stack-list__checkbox-indicator" aria-hidden="true" />
                  </label>
                  <div className="stack-list__content">
                    <strong>{entry.date.slice(0, 10)}</strong>
                    <span>{entry.reason || '理由未入力'}</span>
                  </div>
                  <button
                    className="button button-secondary"
                    onClick={() => openRemoveModal([entry.date.slice(0, 10)])}
                    type="button"
                  >
                    解除する
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <p className="card-kicker">{modalMode === 'create' ? '予約不可日登録' : '予約不可日解除'}</p>
            <h2>
              {modalMode === 'create'
                ? `${selectedDates.length}日を予約不可にする`
                : `${selectedDates.length}日を予約可能に戻す`}
            </h2>
            <div className="selection-chip-list">
              {selectedDates.map((date) => (
                <span key={date} className="selection-chip">
                  {date}
                </span>
              ))}
            </div>
            {modalMode === 'create' ? (
              <label className="booking-form">
                <span>理由</span>
                <select
                  value={singleReason}
                  onChange={(event) => setSingleReason(event.target.value as BlockedDateReason)}
                >
                  {blockedDateReasonOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="section-description">
                選択した日付の予約不可設定を解除して、再び予約可能に戻します。
              </p>
            )}
            {error ? <p className="error-text">{error}</p> : null}
            <div className="form-actions">
              <button
                className="button button-secondary"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                閉じる
              </button>
              <button className="button button-primary" onClick={handleSubmitSelection} type="button">
                {modalMode === 'create' ? '登録する' : '解除する'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
