import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { ReservationType, SiteContent } from '../../lib/types'

type FeeSiteContentDraft = Pick<
  SiteContent,
  | 'feeHelpText'
  | 'additionalTextbookFeeBasicInitial'
  | 'additionalTextbookFeeBasicRenewal'
  | 'additionalTextbookFeeBasicEnglish'
  | 'additionalTextbookFeeAdvancedInitial'
  | 'additionalTextbookFeeAdvancedRenewal'
>

type HomeSiteContentDraft = Pick<
  SiteContent,
  'heroTitle' | 'heroDescription' | 'guideTitle' | 'guideBody' | 'fireStationPhone'
>

export function AdminSettingsPage() {
  const [monthlyLimit, setMonthlyLimit] = useState(10)
  const [weeklyLimit, setWeeklyLimit] = useState(3)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [maxConsecutiveOpenDays, setMaxConsecutiveOpenDays] = useState(5)
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([])
  const [loadedSiteContent, setLoadedSiteContent] = useState<SiteContent | null>(null)
  const [feeContent, setFeeContent] = useState<FeeSiteContentDraft>({
    feeHelpText: '講習料は振込対応のみです。当日振込用紙をお渡しします。',
    additionalTextbookFeeBasicInitial: 0,
    additionalTextbookFeeBasicRenewal: 0,
    additionalTextbookFeeBasicEnglish: 0,
    additionalTextbookFeeAdvancedInitial: 0,
    additionalTextbookFeeAdvancedRenewal: 0,
  })
  const [homeContent, setHomeContent] = useState<HomeSiteContentDraft>({
    heroTitle: '',
    heroDescription: '',
    guideTitle: '',
    guideBody: '',
    fireStationPhone: '',
  })
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout> | null = null

    if (toastMessage) {
      toastTimer = setTimeout(() => {
        setToastMessage('')
      }, 2400)
    }

    return () => {
      if (toastTimer) {
        clearTimeout(toastTimer)
      }
    }
  }, [toastMessage])

  function syncSiteContent(content: SiteContent) {
    setLoadedSiteContent(content)
    setHomeContent({
      heroTitle: content.heroTitle,
      heroDescription: content.heroDescription,
      guideTitle: content.guideTitle,
      guideBody: content.guideBody,
      fireStationPhone: content.fireStationPhone,
    })
    setFeeContent({
      feeHelpText: content.feeHelpText,
      additionalTextbookFeeBasicInitial: content.additionalTextbookFeeBasicInitial,
      additionalTextbookFeeBasicRenewal: content.additionalTextbookFeeBasicRenewal,
      additionalTextbookFeeBasicEnglish: content.additionalTextbookFeeBasicEnglish,
      additionalTextbookFeeAdvancedInitial: content.additionalTextbookFeeAdvancedInitial,
      additionalTextbookFeeAdvancedRenewal: content.additionalTextbookFeeAdvancedRenewal,
    })
  }

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
          setError('ホーム設定の取得に失敗しました')
          return
        }

        syncSiteContent(content)
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error ? loadError.message : 'ホーム設定の取得に失敗しました'
        )
      })
  }, [])

  const showSavedToast = () => {
    setToastMessage('保存しました')
  }

  const buildFeePayload = () => {
    if (!loadedSiteContent) {
      throw new Error('ホーム設定の取得が完了していません')
    }

    return {
      heroTitle: loadedSiteContent.heroTitle,
      heroDescription: loadedSiteContent.heroDescription,
      guideTitle: loadedSiteContent.guideTitle,
      guideBody: loadedSiteContent.guideBody,
      fireStationPhone: loadedSiteContent.fireStationPhone,
      ...feeContent,
    }
  }

  const buildHomePayload = () => {
    if (!loadedSiteContent) {
      throw new Error('ホーム設定の取得が完了していません')
    }

    return {
      ...homeContent,
      feeHelpText: loadedSiteContent.feeHelpText,
      additionalTextbookFeeBasicInitial: loadedSiteContent.additionalTextbookFeeBasicInitial,
      additionalTextbookFeeBasicRenewal: loadedSiteContent.additionalTextbookFeeBasicRenewal,
      additionalTextbookFeeBasicEnglish: loadedSiteContent.additionalTextbookFeeBasicEnglish,
      additionalTextbookFeeAdvancedInitial: loadedSiteContent.additionalTextbookFeeAdvancedInitial,
      additionalTextbookFeeAdvancedRenewal: loadedSiteContent.additionalTextbookFeeAdvancedRenewal,
    }
  }

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
              setError('')

              try {
                await api.updateBookingSettings({
                  monthlyLimit,
                  weeklyLimit,
                  dailyLimit,
                  maxConsecutiveOpenDays,
                })
                showSavedToast()
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
            <h2>受講種別ごとの時間と料金設定</h2>
          </div>
        </div>

        <form
          className="booking-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')

            try {
              const nextReservationTypes = await Promise.all(
                reservationTypes.map((type) =>
                  api.updateReservationType(type.id, {
                    durationMinutes: type.durationMinutes,
                    textbookFee: type.textbookFee,
                    isActive: type.isActive,
                  })
                )
              )
              setReservationTypes(nextReservationTypes)

              const updatedSiteContent = await api.updateHomeSiteContent(buildFeePayload())
              syncSiteContent(updatedSiteContent)
              showSavedToast()
            } catch (saveError) {
              setError(
                saveError instanceof Error ? saveError.message : '料金設定の保存に失敗しました'
              )
            }
          }}
        >
          <div className="type-settings-table">
            <div className="type-settings-table__head">
              <span>種別</span>
              <span>所要時間</span>
              <span>テキスト代金</span>
              <span>有効</span>
            </div>
            {reservationTypes.map((type) => (
              <div key={type.id} className="type-settings-table__row">
                <span>{type.name}</span>
                <input
                  step={300}
                  type="time"
                  value={formatMinutesToTime(type.durationMinutes)}
                  onChange={(event) =>
                    setReservationTypes((current) =>
                      current.map((entry) =>
                        entry.id === type.id
                          ? {
                              ...entry,
                              durationMinutes: parseTimeToMinutesOrKeep(
                                event.target.value,
                                entry.durationMinutes
                              ),
                            }
                          : entry
                      )
                    )
                  }
                />
                <input
                  value={String(type.textbookFee)}
                  onChange={(event) =>
                    setReservationTypes((current) =>
                      current.map((entry) =>
                        entry.id === type.id
                          ? {
                              ...entry,
                              textbookFee: Number(event.target.value) || 0,
                            }
                          : entry
                      )
                    )
                  }
                />
                <label className="switch-label">
                  <input
                    checked={type.isActive}
                    onChange={(event) =>
                      setReservationTypes((current) =>
                        current.map((entry) =>
                          entry.id === type.id
                            ? {
                                ...entry,
                                isActive: event.target.checked,
                              }
                            : entry
                        )
                      )
                    }
                    type="checkbox"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="section-head section-head--embedded">
            <div>
              <p className="card-kicker">追加テキスト料金</p>
              <h2>追加テキスト金額と案内コメント</h2>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span>追加テキスト 普通（新規）</span>
              <input
                min="0"
                type="number"
                value={feeContent.additionalTextbookFeeBasicInitial}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    additionalTextbookFeeBasicInitial: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>
            <label>
              <span>追加テキスト 普通（再講習）</span>
              <input
                min="0"
                type="number"
                value={feeContent.additionalTextbookFeeBasicRenewal}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    additionalTextbookFeeBasicRenewal: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>
            <label>
              <span>追加テキスト 普通（英語版）</span>
              <input
                min="0"
                type="number"
                value={feeContent.additionalTextbookFeeBasicEnglish}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    additionalTextbookFeeBasicEnglish: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>
            <label>
              <span>追加テキスト 上級（新規）</span>
              <input
                min="0"
                type="number"
                value={feeContent.additionalTextbookFeeAdvancedInitial}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    additionalTextbookFeeAdvancedInitial: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>
            <label>
              <span>追加テキスト 上級（再講習）</span>
              <input
                min="0"
                type="number"
                value={feeContent.additionalTextbookFeeAdvancedRenewal}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    additionalTextbookFeeAdvancedRenewal: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>
            <label className="form-grid__wide">
              <span>料金案内コメント</span>
              <textarea
                rows={4}
                value={feeContent.feeHelpText}
                onChange={(event) =>
                  setFeeContent((current) => ({
                    ...current,
                    feeHelpText: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button button-primary" disabled={!loadedSiteContent} type="submit">
            料金設定を保存する
          </button>
        </form>
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
            setError('')

            try {
              const updatedSiteContent = await api.updateHomeSiteContent(buildHomePayload())
              syncSiteContent(updatedSiteContent)
              showSavedToast()
            } catch (saveError) {
              setError(
                saveError instanceof Error ? saveError.message : 'ホーム文言の保存に失敗しました'
              )
            }
          }}
        >
          <label>
            <span>メイン見出し</span>
            <input
              value={homeContent.heroTitle}
              onChange={(event) =>
                setHomeContent((current) => ({
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
              value={homeContent.heroDescription}
              onChange={(event) =>
                setHomeContent((current) => ({
                  ...current,
                  heroDescription: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>案内セクション見出し</span>
            <input
              value={homeContent.guideTitle}
              onChange={(event) =>
                setHomeContent((current) => ({
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
              value={homeContent.guideBody}
              onChange={(event) =>
                setHomeContent((current) => ({
                  ...current,
                  guideBody: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>消防署電話番号</span>
            <input
              value={homeContent.fireStationPhone}
              onChange={(event) =>
                setHomeContent((current) => ({
                  ...current,
                  fireStationPhone: event.target.value,
                }))
              }
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button button-primary" disabled={!loadedSiteContent} type="submit">
            ホーム文言を保存する
          </button>
        </form>
      </section>

      {toastMessage ? (
        <div className="toast-notice" role="status">
          {toastMessage}
        </div>
      ) : null}
    </section>
  )
}

function formatMinutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function parseTimeToMinutesOrKeep(value: string, fallback: number) {
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return fallback
  }

  return hours * 60 + minutes
}
