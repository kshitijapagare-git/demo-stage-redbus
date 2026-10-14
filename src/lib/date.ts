export const TODAY_OFFSET = 0
export const TOMORROW_OFFSET = 1

export interface DayOption {
  offset: number
  label: string
}

export const DAY_OPTIONS: DayOption[] = [
  { offset: TODAY_OFFSET, label: 'Today' },
  { offset: TOMORROW_OFFSET, label: 'Tomorrow' },
]

export interface JourneyDay {
  date: Date
  label: string
}

export function getJourneyDay(today: Date, offset: number): JourneyDay {
  const option = DAY_OPTIONS.find((dayOption) => dayOption.offset === offset)
  return { date: addDays(today, offset), label: option?.label ?? '' }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(date.getDate() + days)
  return result
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return `${day} ${month}, ${year}`
}
