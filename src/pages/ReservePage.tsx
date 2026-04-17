import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { patchBookingDraft } from '../lib/bookingDraft'
import type { AvailabilityResponse } from '../lib/types'
import { CalendarPicker } from '../components/booking/CalendarPicker'

export function ReservePage() {
  const navigate = useNavigate()
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [showStickyCta, setShowStickyCta] = useState(false)
  const primaryCtaRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    void api.getAvailability().then(setAvailability).catch(() => setAvailability(null))
  }, [])

  useEffect(() => {
    const button = primaryCtaRef.current

    if (!button) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    observer.observe(button)

    return () => {
      observer.disconnect()
    }
  }, [])

  const blockedDateStrings = useMemo(
    () => availability?.effectiveBlockedDates.map((entry) => entry.date) ?? [],
    [availability]
  )

  const handleProceed = () => {
    patchBookingDraft({ preferredDate: selectedDate })
    navigate('/reserve/form')
  }

  return (
    <main className="page-shell">
      <section className="hero-panel hero-panel--compact">
        <div className="hero-copy">
          <p className="eyebrow">予約カレンダー</p>
          <h1>まずは受講したい日程を選択してください。</h1>
          <p className="lead">
            大きなカレンダーから希望日を選び、そのまま予約フォームへ進みます。予約不可日は選択できません。
          </p>
        </div>
      </section>

      <section className="calendar-section">
        <div className="section-head">
          <div>
            <p className="card-kicker">手順 1</p>
            <h2>希望日を選ぶ</h2>
          </div>
          <button
            className="button button-primary cta-animated"
            disabled={!selectedDate}
            onClick={handleProceed}
            ref={primaryCtaRef}
            type="button"
          >
            フォームへ進む
          </button>
        </div>

        <CalendarPicker
          blockedDates={blockedDateStrings}
          onSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      </section>

      {showStickyCta ? (
        <div className="sticky-cta" role="presentation">
          <div className="sticky-cta__inner">
            <div className="sticky-cta__copy">
              <p className="card-kicker">次の手順</p>
              <p>{selectedDate ? `${selectedDate} を選択中です` : '希望日を選択してください'}</p>
            </div>
            <button
              className="button button-primary cta-animated"
              disabled={!selectedDate}
              onClick={handleProceed}
              type="button"
            >
              フォームへ進む
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
