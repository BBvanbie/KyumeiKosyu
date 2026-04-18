import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { getBookingDraft, saveBookingDraft } from '../lib/bookingDraft'
import { formatPhoneNumber } from '../lib/phone'
import {
  additionalTextbookOptions,
  hasEnglishCourse,
} from '../lib/reservationCatalog'
import {
  calculateEndTime,
  getLongestDurationMinutes,
  getValidReservationItems,
} from '../lib/reservationSchedule'
import {
  emptyBookingDraft,
  type BookingDraft,
  type ReservationItem,
  type ReservationType,
} from '../lib/types'

export function ReservationFormPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<BookingDraft>(getBookingDraft())
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([])
  const [loadError, setLoadError] = useState('')
  const [showInterpreterModal, setShowInterpreterModal] = useState(false)

  useEffect(() => {
    void api
      .getReservationTypes()
      .then((types) => {
        setReservationTypes(types)
        setLoadError('')
      })
      .catch(() => {
        setReservationTypes([])
        setLoadError('講習種別を取得できませんでした。API サーバーが起動しているか確認してください。')
      })
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

  if (!draft.preferredDate) {
    return (
      <main className="page-shell">
        <div className="status-panel">
          希望日が未選択です。<Link to="/reserve">予約ページに戻る</Link>
        </div>
      </main>
    )
  }

  const updateField = <K extends keyof BookingDraft>(field: K, value: BookingDraft[K]) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (
      !draft.fullName ||
      !draft.phone ||
      !draft.preferredStartTime ||
      !draft.organizationName ||
      !draft.venueAddress ||
      !draft.targetAudience ||
      validItems.length === 0
    ) {
      return
    }

    if (hasEnglishReservation) {
      if (draft.interpreterAvailable === 'unavailable') {
        setShowInterpreterModal(true)
        return
      }

      if (
        draft.interpreterAvailable !== 'available' ||
        draft.japaneseTextbookCount === '' ||
        draft.englishTextbookCount === ''
      ) {
        return
      }
    }

    saveBookingDraft({
      ...draft,
      items: draft.items.map((item) => ({
        ...item,
        participantCount: Number(item.participantCount) || 0,
      })),
    })
    navigate('/reserve/confirm')
  }

  return (
    <main className="page-shell">
      <section className="form-shell">
        <div className="section-head">
          <div>
            <p className="card-kicker">手順 2</p>
            <h1>予約フォーム</h1>
          </div>
          <p className="lead lead--small">選択日: {draft.preferredDate}</p>
        </div>

        <form
          className="booking-form"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <section className="form-card">
            <h2>予約者情報</h2>
            <div className="form-grid">
              <label>
                <span>氏名 *</span>
                <input
                  required
                  placeholder="例: 消防 太郎"
                  value={draft.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                />
              </label>
              <label>
                <span>電話番号 *</span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="例: 090-1234-5678"
                  type="tel"
                  value={draft.phone}
                  onChange={(event) => updateField('phone', formatPhoneNumber(event.target.value))}
                />
              </label>
              <label className="form-grid__wide">
                <span>住所</span>
                <input
                  placeholder="例: 千代田区〇〇1-2-3"
                  value={draft.address}
                  onChange={(event) => updateField('address', event.target.value)}
                />
              </label>
              <label className="form-grid__wide">
                <span>メールアドレス</span>
                <input
                  placeholder="例: sample@example.jp"
                  type="email"
                  value={draft.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="form-card">
            <h2>受講団体情報</h2>
            <div className="form-grid">
              <label>
                <span>団体名 *</span>
                <input
                  required
                  placeholder="例: ○○株式会社"
                  value={draft.organizationName}
                  onChange={(event) => updateField('organizationName', event.target.value)}
                />
              </label>
              <label className="form-grid__wide">
                <span>実施場所住所 *</span>
                <input
                  required
                  placeholder="例: 千代田区〇〇1-2-3 ○○会議室"
                  value={draft.venueAddress}
                  onChange={(event) => updateField('venueAddress', event.target.value)}
                />
              </label>
              <label className="form-grid__wide">
                <span>受講対象者 *</span>
                <input
                  required
                  placeholder="例: 職員、教員、会員等"
                  value={draft.targetAudience}
                  onChange={(event) => updateField('targetAudience', event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="form-card">
            <h2>受講内容</h2>
            <div className="form-grid">
              {loadError ? <p className="error-text form-grid__wide">{loadError}</p> : null}
              <div className="form-grid__wide schedule-row">
                <label>
                  <span>開始希望時間 *</span>
                  <input
                    required
                    type="time"
                    value={draft.preferredStartTime}
                    onChange={(event) => updateField('preferredStartTime', event.target.value)}
                  />
                </label>
                <div className="schedule-note">
                  <span>終了予定時間</span>
                  <strong>{estimatedEndTime || '--:--'}</strong>
                  <p>
                    選択された講習のうち、最も長い講習時間を基準に終了予定時間を表示します。
                  </p>
                </div>
              </div>
              <div className="form-grid__wide booking-item-table">
                <div className="booking-item-table__head">
                  <span>種別リスト</span>
                  <span>人数</span>
                </div>
                {draft.items.map((item, index) => (
                  <BookingItemRow
                    key={item.sortOrder}
                    item={item}
                    onChange={(nextItem) => {
                      setDraft((current) => ({
                        ...current,
                        items: current.items.map((entry, entryIndex) =>
                          entryIndex === index ? nextItem : entry
                        ),
                      }))
                    }}
                    reservationTypes={reservationTypes}
                  />
                ))}
              </div>

              {hasEnglishReservation ? (
                <>
                  <div className="form-grid__wide">
                    <span className="field-label">英語版講習の確認</span>
                    <div className="choice-row">
                      <label>
                        <input
                          checked={draft.interpreterAvailable === 'available'}
                          name="interpreterAvailable"
                          required
                          type="radio"
                          onChange={() => updateField('interpreterAvailable', 'available')}
                        />
                        <span>通訳手配が可能</span>
                      </label>
                      <label>
                        <input
                          checked={draft.interpreterAvailable === 'unavailable'}
                          name="interpreterAvailable"
                          required
                          type="radio"
                          onChange={() => updateField('interpreterAvailable', 'unavailable')}
                        />
                        <span>通訳手配が不可</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-grid__wide form-grid">
                    <label>
                      <span>日本語テキスト必要部数 *</span>
                      <input
                        required
                        min="0"
                        type="number"
                        value={draft.japaneseTextbookCount}
                        onChange={(event) =>
                          updateField(
                            'japaneseTextbookCount',
                            event.target.value.replace(/\D/g, '')
                          )
                        }
                      />
                    </label>
                    <label>
                      <span>英語版テキスト必要部数 *</span>
                      <input
                        required
                        min="0"
                        type="number"
                        value={draft.englishTextbookCount}
                        onChange={(event) =>
                          updateField(
                            'englishTextbookCount',
                            event.target.value.replace(/\D/g, '')
                          )
                        }
                      />
                    </label>
                  </div>
                </>
              ) : null}

              {validItems.length > 1 ? (
                <p className="form-grid__wide warning-text">
                  複数の講習種別が選択されています。講習時間は最も長いものに合わせます。別をご希望の場合は、別日に講習を分けて予約してください。
                </p>
              ) : null}
            </div>
          </section>

          <section className="form-card">
            <h2>追加テキスト購入</h2>
            <label className="toggle-row">
              <input
                checked={draft.wantsAdditionalTextbooks}
                type="checkbox"
                onChange={(event) =>
                  updateField('wantsAdditionalTextbooks', event.target.checked)
                }
              />
              <span>追加購入されたい方はこちらをチェック</span>
            </label>
            <p className="lead lead--small">
              講習人数とは別で、テキストのみ追加で必要な場合に入力してください。
            </p>
            <div
              className={`form-grid${draft.wantsAdditionalTextbooks ? '' : ' form-grid--disabled'}`}
            >
              {additionalTextbookOptions.map((option) => (
                <label key={option.key}>
                  <span>{option.label}</span>
                  <input
                    disabled={!draft.wantsAdditionalTextbooks}
                    min="0"
                    type="number"
                    value={draft.additionalTextbookCounts[option.key] || ''}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        additionalTextbookCounts: {
                          ...current.additionalTextbookCounts,
                          [option.key]: Number(event.target.value) || 0,
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="form-card">
            <h2>備考</h2>
            <label className="booking-form">
              <span>連絡事項</span>
              <textarea
                rows={5}
                placeholder="例: 駐車場利用希望、開始時間の相談など"
                value={draft.notes}
                onChange={(event) => updateField('notes', event.target.value)}
              />
            </label>
          </section>

          <div className="form-actions">
            <button
              className="button button-secondary"
              onClick={() => {
                saveBookingDraft(emptyBookingDraft)
                navigate('/reserve')
              }}
              type="button"
            >
              日付選択へ戻る
            </button>
            <button className="button button-primary" type="submit">
              予約確認へ進む
            </button>
          </div>
        </form>
      </section>

      {showInterpreterModal ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <p className="card-kicker">受付方法のご案内</p>
            <h2>消防署で電話受付となります</h2>
            <p>
              英語版講習は通訳手配が必要です。通訳手配が難しい場合は、消防署で電話受付となるため、この画面からは予約できません。
            </p>
            <button
              className="button button-primary"
              onClick={() => setShowInterpreterModal(false)}
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

function BookingItemRow({
  item,
  onChange,
  reservationTypes,
}: {
  item: ReservationItem
  onChange: (item: ReservationItem) => void
  reservationTypes: ReservationType[]
}) {
  return (
    <div className="booking-item-row">
      <select
        value={item.reservationTypeId}
        onChange={(event) =>
          onChange({
            ...item,
            reservationTypeId: event.target.value,
          })
        }
      >
        <option value="">選択してください</option>
        {reservationTypes
          .filter((type) => type.isActive)
          .map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} / {formatDuration(type.durationMinutes)} / {formatCurrency(type.textbookFee)}
            </option>
          ))}
      </select>

      <input
        min="0"
        type="number"
        value={item.participantCount || ''}
        onChange={(event) =>
          onChange({
            ...item,
            participantCount: Number(event.target.value) || 0,
          })
        }
      />
    </div>
  )
}

function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('ja-JP')}円`
}
