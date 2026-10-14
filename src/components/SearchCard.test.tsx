import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchCard from './SearchCard'

describe('SearchCard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 2, 10, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows today's date by default", () => {
    render(<SearchCard />)
    expect(screen.getByText('02 Oct, 2026')).toBeInTheDocument()
    expect(screen.getByText('(Today)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'true')
  })

  it("switches to tomorrow's date when Tomorrow is clicked", async () => {
    const user = userEvent.setup()
    render(<SearchCard />)
    await user.click(screen.getByRole('button', { name: 'Tomorrow' }))
    expect(screen.getByText('03 Oct, 2026')).toBeInTheDocument()
    expect(screen.getByText('(Tomorrow)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tomorrow' })).toHaveClass('chip-active')
  })

  it('selects a day chip with the keyboard', async () => {
    const user = userEvent.setup()
    render(<SearchCard />)
    screen.getByRole('button', { name: 'Tomorrow' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('03 Oct, 2026')).toBeInTheDocument()
  })

  it('toggles the booking-for-women switch', async () => {
    const user = userEvent.setup()
    render(<SearchCard />)
    const toggle = screen.getByRole('switch', { name: 'Booking for women' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
})
