import { describe, expect, it } from 'vitest'
import { addDays, formatDate, getJourneyDay, TODAY_OFFSET, TOMORROW_OFFSET } from './date'

describe('getJourneyDay', () => {
  const today = new Date(2026, 9, 2)

  it('returns today with the Today label', () => {
    const journeyDay = getJourneyDay(today, TODAY_OFFSET)
    expect(formatDate(journeyDay.date)).toBe('02 Oct, 2026')
    expect(journeyDay.label).toBe('Today')
  })

  it('returns tomorrow with the Tomorrow label', () => {
    const journeyDay = getJourneyDay(today, TOMORROW_OFFSET)
    expect(formatDate(journeyDay.date)).toBe('03 Oct, 2026')
    expect(journeyDay.label).toBe('Tomorrow')
  })
})

describe('formatDate', () => {
  it('formats as "DD Mon, YYYY"', () => {
    expect(formatDate(new Date(2026, 9, 2))).toBe('02 Oct, 2026')
  })
})

describe('addDays', () => {
  it('adds days across a month boundary', () => {
    expect(formatDate(addDays(new Date(2026, 9, 31), 1))).toBe('01 Nov, 2026')
  })

  it('does not mutate the input date', () => {
    const start = new Date(2026, 9, 2)
    addDays(start, 1)
    expect(formatDate(start)).toBe('02 Oct, 2026')
  })
})
