import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { ReservationType, SiteContent } from '../../lib/types'

export function AdminSettingsPage() {
  const [monthlyLimit, setMonthlyLimit] = useState(10)
  const [weeklyLimit, setWeeklyLimit] = useState(3)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [maxConsecutiveOpenDays, setMaxConsecutiveOpenDays] = useState(5)
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([])
  const [siteContent, setSiteContent] = useState<Omit<SiteContent, 'id' | 'updatedAt'>>({
    heroTitle: '',
    heroDescription: '',
    guideTitle: '',
    guideBody: '',
    fireStationPhone: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    void api
      .getBookingSettings()
      .then((setting) => {
        setMonthlyLimit(setting.monthlyLimit)
        setWeeklyLimit(setting.weeklyLimit)
        setDailyLimit(setting.dailyLimit)
        setMaxConsecutiveOpenDays(setting.maxConsecutiveOpenDays)
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : '設定の取得に失敗しました')
      })

    void api.getReservationTypes().then(setReservationTypes).catch(() => setReservationTypes([]))
    void api
      .getHomeSiteContent()
      .then((content) => {
        if (!content) {
          return
        }

        setSiteContent({
          heroTitle: content.heroTitle,
          heroDescription: content.heroDescription,
          guideTitle: content.guideTitle,
          guideBody: content.guideBody,
          fireStationPhone: content.fireStationPhone,
        })
      })
      .catch(() => undefined)
  }, [])

  return (
    <section className="admin-page">
      <div className="section-head">
        <div>
          <p className="card-kicker">各種設定</p>
          <h1>設定</h1>
        </div>
      </div>

      <section className="admin-card-grid">
        <article className="form-card">
          <h2>予約受付上限</h2>
          <form
            className="booking-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setMessage('')
              setError('')

              try {
                await api.updateBookingSettings({
                  monthlyLimit,
                  weeklyLimit,
                  dailyLimit,
                  maxConsecutiveOpenDays,
                })
                setMessage('設定を保存しました')
              } catch (saveError) {
                setError(saveError instanceof Error ? saveError.message : '設定の保存に失敗しました')
              }
            }}
          >
            <label>
              <span>月の予約上限件数</span>
              <input
                min="1"
                type="number"
                value={monthlyLimit}
                onChange={(event) => setMonthlyLimit(Number(event.target.value))}
              />
            </label>
            <label>
              <span>週の予約上限件数</span>
              <input
                min="1"
                type="number"
                value={weeklyLimit}
                onChange={(event) => setWeeklyLimit(Number(event.target.value))}
              />
            </label>
            <label>
              <span>一日の予約上限件数</span>
              <input
                min="1"
                type="number"
                value={dailyLimit}
                onChange={(event) => setDailyLimit(Number(event.target.value))}
              />
            </label>
            <label>
              <span>連続営業日数の上限</span>
              <input
                min="1"
                type="number"
                value={maxConsecutiveOpenDays}
                onChange={(event) => setMaxConsecutiveOpenDays(Number(event.target.value))}
              />
            </label>

            {message ? <p className="success-text">{message}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}

            <button className="button button-primary" type="submit">
              保存する
            </button>
          </form>
        </article>

        <article className="info-card">
          <p className="card-kicker">運用ルール</p>
          <h2>上限に達した単位は残り枠ごと停止</h2>
          <p>
            月、週、日いずれかの上限件数に達した時点で、その単位の残り日程は予約不可になります。
          </p>
          <p>
            連続営業日数上限は、連続して予約可能にする営業日の長さを制御します。上限を超える日は自動で予約不可になります。
          </p>
        </article>
      </section>

      <section className="form-card form-card--stacked">
        <div className="section-head">
          <div>
            <p className="card-kicker">受講種別設定</p>
            <h2>受講種別ごとの時間とテキスト代金</h2>
          </div>
        </div>

        <div className="type-settings-table">
          <div className="type-settings-table__head">
            <span>種別</span>
            <span>所要時間</span>
            <span>テキスト代金</span>
            <span>有効</span>
            <span>保存</span>
          </div>
          {reservationTypes.map((type) => (
            <ReservationTypeSettingRow
              key={type.id}
              onSaved={(nextType) => {
                setReservationTypes((current) =>
                  current.map((entry) => (entry.id === nextType.id ? nextType : entry))
                )
                setMessage(`「${nextType.name}」を保存しました`)
              }}
              onError={setError}
              reservationType={type}
            />
          ))}
        </div>
      </section>

      <section className="form-card form-card--stacked">
        <div className="section-head">
          <div>
            <p className="card-kicker">ホーム文言</p>
            <h2>ホーム画面の案内文を変更する</h2>
          </div>
        </div>

        <form
          className="booking-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setMessage('')
            setError('')

            try {
              await api.updateHomeSiteContent(siteContent)
              setMessage('ホーム画面の文言を保存しました')
            } catch (saveError) {
              setError(saveError instanceof Error ? saveError.message : 'ホーム文言の保存に失敗しました')
            }
          }}
        >
          <label>
            <span>メイン見出し</span>
            <input
              value={siteContent.heroTitle}
              onChange={(event) =>
                setSiteContent((current) => ({
                  ...current,
                  heroTitle: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>サブ説明文</span>
            <textarea
              rows={4}
              value={siteContent.heroDescription}
              onChange={(event) =>
                setSiteContent((current) => ({
                  ...current,
                  heroDescription: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>案内セクション見出し</span>
            <input
              value={siteContent.guideTitle}
              onChange={(event) =>
                setSiteContent((current) => ({
                  ...current,
                  guideTitle: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>案内本文</span>
            <textarea
              rows={5}
              value={siteContent.guideBody}
              onChange={(event) =>
                setSiteContent((current) => ({
                  ...current,
                  guideBody: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>消防署電話番号</span>
            <input
              value={siteContent.fireStationPhone}
              onChange={(event) =>
                setSiteContent((current) => ({
                  ...current,
                  fireStationPhone: event.target.value,
                }))
              }
            />
          </label>
          <button className="button button-primary" type="submit">
            ホーム文言を保存する
          </button>
        </form>
      </section>
    </section>
  )
}

function ReservationTypeSettingRow({
  onError,
  onSaved,
  reservationType,
}: {
  onError: (message: string) => void
  onSaved: (reservationType: ReservationType) => void
  reservationType: ReservationType
}) {
  const [duration, setDuration] = useState(formatMinutesToTime(reservationType.durationMinutes))
  const [textbookFee, setTextbookFee] = useState(String(reservationType.textbookFee))
  const [isActive, setIsActive] = useState(reservationType.isActive)

  return (
    <div className="type-settings-table__row">
      <span>{reservationType.name}</span>
      <input value={duration} onChange={(event) => setDuration(event.target.value)} />
      <input value={textbookFee} onChange={(event) => setTextbookFee(event.target.value)} />
      <label className="switch-label">
        <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" />
        <span>{isActive ? '有効' : '停止'}</span>
      </label>
      <button
        className="button button-secondary"
        onClick={async () => {
          onError('')

          try {
            const saved = await api.updateReservationType(reservationType.id, {
              durationMinutes: parseTimeToMinutes(duration),
              textbookFee: Number(textbookFee) || 0,
              isActive,
            })
            onSaved(saved)
          } catch (saveError) {
            onError(saveError instanceof Error ? saveError.message : '受講種別の保存に失敗しました')
          }
        }}
        type="button"
      >
        保存
      </button>
    </div>
  )
}

function formatMinutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${hours}:${String(remainder).padStart(2, '0')}`
}

function parseTimeToMinutes(value: string) {
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new Error('時間は h:mm 形式で入力してください')
  }

  return hours * 60 + minutes
}
