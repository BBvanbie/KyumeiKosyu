import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CompletionModal } from '../components/booking/CompletionModal'
import { api } from '../lib/api'
import { clearBookingDraft, getBookingDraft } from '../lib/bookingDraft'
import {
  additionalTextbookOptions,
  hasEnglishCourse,
} from '../lib/reservationCatalog'
import {
  calculateEndTime,
  getLongestDurationMinutes,
  getValidReservationItems,
} from '../lib/reservationSchedule'
import type { ReservationType } from '../lib/types'

export function ReservationConfirmPage() {
  const navigate = useNavigate()
  const draft = getBookingDraft()
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [reservationNumber, setReservationNumber] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')

  useEffect(() => {
    void api.getReservationTypes().then(setReservationTypes).catch(() => setReservationTypes([]))
  }, [])

  const validItems = useMemo(() => getValidReservationItems(draft.items), [draft.items])
  const hasEnglishReservation = useMemo(
    () => hasEnglishCourse(draft.items, reservationTypes),
    [draft.items, reservationTypes]
  )
  const longestDurationMinutes = useMemo(
    () => getLongestDurationMinutes(draft.items, reservationTypes),
    [draft.items, reservationTypes]
  )
  const estimatedEndTime = useMemo(
    () => calculateEndTime(draft.preferredStartTime, longestDurationMinutes),
    [draft.preferredStartTime, longestDurationMinutes]
  )

  if (
    !draft.preferredDate ||
    !draft.fullName ||
    !draft.phone ||
    !draft.preferredStartTime ||
    !draft.organizationName ||
    !draft.venueAddress ||
    !draft.targetAudience ||
    validItems.length === 0 ||
    (hasEnglishReservation &&
      (draft.interpreterAvailable !== 'available' ||
        draft.japaneseTextbookCount === '' ||
        draft.englishTextbookCount === ''))
  ) {
    return (
      <main className="page-shell">
        <div className="status-panel">
          入力途中の予約情報が見つかりません。<Link to="/reserve/form">フォームへ戻る</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="form-shell">
        <div className="section-head">
          <div>
            <p className="card-kicker">手順 3</p>
            <h1>予約内容の確認</h1>
          </div>
        </div>

        <section className="summary-card">
          <dl className="summary-grid">
            <div>
              <dt>希望日</dt>
              <dd>{draft.preferredDate}</dd>
            </div>
            <div>
              <dt>開始希望時間</dt>
              <dd>{draft.preferredStartTime}</dd>
            </div>
            <div>
              <dt>終了予定時間</dt>
              <dd>{estimatedEndTime || '--:--'}</dd>
            </div>
            <div>
              <dt>氏名</dt>
              <dd>{draft.fullName}</dd>
            </div>
            <div>
              <dt>電話番号</dt>
              <dd>{draft.phone}</dd>
            </div>
            <div>
              <dt>メールアドレス</dt>
              <dd>{draft.email || '-'}</dd>
            </div>
            <div>
              <dt>団体名</dt>
              <dd>{draft.organizationName}</dd>
            </div>
            <div>
              <dt>実施場所住所</dt>
              <dd>{draft.venueAddress}</dd>
            </div>
            <div>
              <dt>受講対象者</dt>
              <dd>{draft.targetAudience}</dd>
            </div>
            <div>
              <dt>備考</dt>
              <dd>{draft.notes || '-'}</dd>
            </div>
          </dl>

          <div className="summary-items">
            <h2>受講内容</h2>
            <div className="summary-items__list">
              {validItems.map((item) => {
                const reservationType = reservationTypes.find((type) => type.id === item.reservationTypeId)

                return (
                  <div key={item.sortOrder} className="summary-items__row">
                    <span>{reservationType?.name ?? '未選択'}</span>
                    <span>{item.participantCount}名</span>
                  </div>
                )
              })}
            </div>
          </div>

          {hasEnglishReservation ? (
            <div className="summary-items">
              <h2>英語版講習の確認</h2>
              <div className="summary-grid">
                <div>
                  <dt>通訳手配</dt>
                  <dd>{draft.interpreterAvailable === 'available' ? '可能' : '不可'}</dd>
                </div>
                <div>
                  <dt>日本語テキスト必要部数</dt>
                  <dd>{draft.japaneseTextbookCount}部</dd>
                </div>
                <div>
                  <dt>英語版テキスト必要部数</dt>
                  <dd>{draft.englishTextbookCount}部</dd>
                </div>
              </div>
            </div>
          ) : null}

          {draft.wantsAdditionalTextbooks ? (
            <div className="summary-items">
              <h2>追加テキスト購入</h2>
              <div className="summary-items__list">
                {additionalTextbookOptions
                  .filter((option) => draft.additionalTextbookCounts[option.key] > 0)
                  .map((option) => (
                    <div key={option.key} className="summary-items__row">
                      <span>{option.label}</span>
                      <span>{draft.additionalTextbookCounts[option.key]}部</span>
                    </div>
                  ))}
                {!additionalTextbookOptions.some(
                  (option) => draft.additionalTextbookCounts[option.key] > 0
                ) ? <p>追加購入の指定はありません。</p> : null}
              </div>
            </div>
          ) : null}

          {validItems.length > 1 ? (
            <p className="warning-text">
              複数の講習種別が選択されています。講習時間は最も長いものに合わせます。別をご希望の場合は、別日に講習を分けて予約してください。
            </p>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}

          <div className="form-actions">
            <button className="button button-secondary" onClick={() => navigate('/reserve/form')} type="button">
              フォームへ戻る
            </button>
            <button
              className="button button-primary"
              disabled={isSubmitting}
              onClick={async () => {
                setError('')
                setIsSubmitting(true)

                try {
                  const result = await api.createReservation(draft)
                  setReservationNumber(result.reservation.reservationNumber)
                  setConfirmationCode(result.confirmationCode)
                  clearBookingDraft()
                  setIsModalOpen(true)
                } catch (submitError) {
                  setError(
                    submitError instanceof Error ? submitError.message : '送信に失敗しました'
                  )
                } finally {
                  setIsSubmitting(false)
                }
              }}
              type="button"
            >
              {isSubmitting ? '送信中...' : '予約送信'}
            </button>
          </div>
        </section>
      </section>

      <CompletionModal
        confirmationCode={confirmationCode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          navigate('/')
        }}
        reservationNumber={reservationNumber}
      />
    </main>
  )
}
