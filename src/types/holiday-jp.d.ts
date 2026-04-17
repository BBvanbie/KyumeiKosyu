declare module 'holiday-jp' {
  const holidayJp: {
    isHoliday: (date: Date) => boolean
    between: (start: Date, end: Date) => Array<{
      name: string
      nameEn: string
      wdayName: string
      date: Date
    }>
  }

  export default holidayJp
}
