import dayjs from 'dayjs'
import holidayJp from 'holiday-jp'
import { useMemo, useState } from 'react'

const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土'] as const

type CalendarPickerProps = {
  blockedDates: string[]
  selectedDate: string
  onSelect: (date: string) => void
  disabledBlockedDates?: boolean
  label?: string
}

export function CalendarPicker({
  blockedDates,
  disabledBlockedDates = true,
  label = '予約日カレンダー',
  onSelect,
  selectedDate,
}: CalendarPickerProps) {
  const blocked = new Set(blockedDates.map((date) => dayjs(date).format('YYYY-MM-DD')))
  const [visibleMonth, setVisibleMonth] = useState(
    selectedDate ? dayjs(selectedDate).startOf('month') : dayjs().startOf('month')
  )
  const [animationDirection, setAnimationDirection] = useState<'previous' | 'next'>('next')
  const [animationKey, setAnimationKey] = useState(0)

  const calendarCells = useMemo(() => {
    const startOfMonth = visibleMonth.startOf('month')
    const endOfMonth = visibleMonth.endOf('month')
    const leadingEmptyDays = startOfMonth.day()
    const daysInMonth = endOfMonth.date()
    const totalCells = Math.ceil((leadingEmptyDays + daysInMonth) / 7) * 7

    return Array.from({ length: totalCells }, (_, index) => {
      const dayNumber = index - leadingEmptyDays + 1

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null
      }

      return startOfMonth.date(dayNumber)
    })
  }, [visibleMonth])

  return (
    <div className="calendar" aria-label={label}>
      <div className="calendar-toolbar">
        <button
          className="button button-secondary calendar-toolbar__button"
          onClick={() => {
            setAnimationDirection('previous')
            setAnimationKey((current) => current + 1)
            setVisibleMonth((current) => current.subtract(1, 'month'))
          }}
          type="button"
        >
          前月
        </button>
        <strong className="calendar-toolbar__title">{visibleMonth.format('YYYY年M月')}</strong>
        <button
          className="button button-secondary calendar-toolbar__button"
          onClick={() => {
            setAnimationDirection('next')
            setAnimationKey((current) => current + 1)
            setVisibleMonth((current) => current.add(1, 'month'))
          }}
          type="button"
        >
          次月
        </button>
      </div>

      <div className="calendar-weekdays" role="presentation">
        {weekdayLabels.map((labelText, index) => (
          <span
            key={labelText}
            className={`calendar-weekdays__item${index === 0 ? ' is-sunday' : ''}${index === 6 ? ' is-saturday' : ''}`}
          >
            {labelText}
          </span>
        ))}
      </div>

      <div
        key={`${visibleMonth.format('YYYY-MM')}-${animationKey}`}
        className={`calendar-grid calendar-grid--animated calendar-grid--${animationDirection}`}
        role="grid"
        aria-label={label}
      >
        {calendarCells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="calendar-day calendar-day--empty" />
          }

          const key = date.format('YYYY-MM-DD')
          const isBlocked = blocked.has(key)
          const isSelected = selectedDate === key
          const dayOfWeek = date.day()
          const isSaturday = dayOfWeek === 6
          const isSunday = dayOfWeek === 0
          const isHoliday = holidayJp.isHoliday(date.toDate())
          const className = [
            'calendar-day',
            isSelected ? 'is-selected' : '',
            isBlocked ? 'is-blocked' : '',
            isSaturday ? 'is-saturday' : '',
            isSunday ? 'is-sunday' : '',
            isHoliday ? 'is-holiday' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={key}
              className={className}
              disabled={disabledBlockedDates && isBlocked}
              onClick={() => {
                setVisibleMonth(date.startOf('month'))
                onSelect(key)
              }}
              type="button"
            >
              <span className="calendar-day__month">{date.format('M月')}</span>
              <strong>{date.format('D')}</strong>
              <span className="calendar-day__state">{isBlocked ? '予約不可' : '選択可能'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
