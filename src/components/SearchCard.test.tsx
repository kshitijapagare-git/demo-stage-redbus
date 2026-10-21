import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { testCityOptions } from '../test/fixtures'
import SearchCard from './SearchCard'

const REQUIRED_ERROR = 'Select a city from the list'
const SAME_CITY_ERROR = 'From and To must be different cities'

function fieldOf(input: HTMLElement): HTMLElement {
  const field = input.closest('.field')
  if (!(field instanceof HTMLElement)) throw new Error('Field container not found')
  return field
}

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

  it('stores the selected city id when a suggestion is chosen', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })

    await user.type(fromInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))

    expect(fromInput).toHaveValue('Pune')
    expect(fromInput.closest('.field')).toHaveAttribute('data-city-id', '1')
  })

  it('swaps the From and To selections', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.type(fromInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))
    await user.type(toInput, 'be')
    await user.click(screen.getByRole('option', { name: /Bengaluru/ }))

    expect(fromInput).toHaveValue('Pune')
    expect(toInput).toHaveValue('Bengaluru')

    await user.click(screen.getByRole('button', { name: 'Swap From and To' }))

    expect(fromInput).toHaveValue('Bengaluru')
    expect(toInput).toHaveValue('Pune')
    expect(fromInput.closest('.field')).toHaveAttribute('data-city-id', '2')
    expect(toInput.closest('.field')).toHaveAttribute('data-city-id', '1')

    await user.click(screen.getByRole('button', { name: 'Swap From and To' }))

    expect(fromInput).toHaveValue('Pune')
    expect(toInput).toHaveValue('Bengaluru')
  })

  it('leaves both fields empty when swapping without selections', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)

    await user.click(screen.getByRole('button', { name: 'Swap From and To' }))

    expect(screen.getByRole('combobox', { name: 'From' })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: 'To' })).toHaveValue('')
  })

  it('shows an error next to both fields when Search is clicked with nothing selected', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.click(screen.getByRole('button', { name: 'Search buses' }))

    expect(within(fieldOf(fromInput)).getByRole('alert')).toHaveTextContent(REQUIRED_ERROR)
    expect(within(fieldOf(toInput)).getByRole('alert')).toHaveTextContent(REQUIRED_ERROR)
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })

  it('shows the empty-field error only next to the field without a city', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.type(fromInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))
    await user.click(screen.getByRole('button', { name: 'Search buses' }))

    expect(within(fieldOf(fromInput)).queryByRole('alert')).toBeNull()
    expect(within(fieldOf(toInput)).getByRole('alert')).toHaveTextContent(REQUIRED_ERROR)
  })

  it('shows the same error next to both fields when both hold the same city', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.type(fromInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))
    await user.type(toInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))
    await user.click(screen.getByRole('button', { name: 'Search buses' }))

    expect(within(fieldOf(fromInput)).getByRole('alert')).toHaveTextContent(SAME_CITY_ERROR)
    expect(within(fieldOf(toInput)).getByRole('alert')).toHaveTextContent(SAME_CITY_ERROR)
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })

  it('shows no error when two different cities are selected', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.type(fromInput, 'pu')
    await user.click(screen.getByRole('option', { name: /Pune/ }))
    await user.type(toInput, 'be')
    await user.click(screen.getByRole('option', { name: /Bengaluru/ }))
    await user.click(screen.getByRole('button', { name: 'Search buses' }))

    expect(screen.queryAllByRole('alert')).toHaveLength(0)
    expect(fromInput).toHaveValue('Pune')
    expect(toInput).toHaveValue('Bengaluru')
  })

  it('treats typed but unselected text as an unfilled field', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.type(fromInput, 'Pun')
    await user.type(toInput, 'be')
    await user.click(screen.getByRole('option', { name: /Bengaluru/ }))
    await user.click(screen.getByRole('button', { name: 'Search buses' }))

    expect(within(fieldOf(fromInput)).getByRole('alert')).toHaveTextContent(REQUIRED_ERROR)
    expect(within(fieldOf(toInput)).queryByRole('alert')).toBeNull()
  })

  it('clears only the error of the field that changed', async () => {
    const user = userEvent.setup()
    render(<SearchCard cities={testCityOptions} />)
    const fromInput = screen.getByRole('combobox', { name: 'From' })
    const toInput = screen.getByRole('combobox', { name: 'To' })

    await user.click(screen.getByRole('button', { name: 'Search buses' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)

    await user.type(fromInput, 'pu')

    expect(within(fieldOf(fromInput)).queryByRole('alert')).toBeNull()
    expect(within(fieldOf(toInput)).getByRole('alert')).toHaveTextContent(REQUIRED_ERROR)
  })
})
