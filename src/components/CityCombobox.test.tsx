import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { City } from '../types'
import CityCombobox from './CityCombobox'

const cityOptions: City[] = [
  { id: 1, name: 'Pune', state: 'Maharashtra' },
  { id: 2, name: 'Bengaluru', state: 'Karnataka' },
  { id: 3, name: 'Puducherry', state: 'Puducherry' },
]

interface HarnessProps {
  initialText?: string
  error?: string
  onSelect?: (city: City) => void
}

function Harness({ initialText = '', error, onSelect }: HarnessProps) {
  const [text, setText] = useState(initialText)
  const [cityId, setCityId] = useState<City['id'] | null>(null)

  return (
    <CityCombobox
      id="from-city"
      ariaLabel="From"
      placeholder="From"
      icon="🚌"
      cities={cityOptions}
      text={text}
      cityId={cityId}
      error={error}
      onChange={(nextText) => {
        setText(nextText)
        setCityId(null)
      }}
      onSelect={(city) => {
        setText(city.name)
        setCityId(city.id)
        onSelect?.(city)
      }}
    />
  )
}

describe('CityCombobox', () => {
  it('suggests matching cities once a character is typed, with the state as secondary text', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByRole('combobox', { name: 'From' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    await user.type(input, 'pu')

    expect(input).toHaveValue('pu')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveAttribute('id', 'from-city-listbox')
    expect(input).toHaveAttribute('aria-controls', listbox.id)

    const puneOption = screen.getByRole('option', { name: /Pune/ })
    expect(puneOption).toHaveTextContent('Maharashtra')
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('moves the highlight with the arrow keys and selects the highlighted city with Enter', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Harness initialText="pu" onSelect={onSelect} />)

    const input = screen.getByRole('combobox', { name: 'From' })
    input.focus()
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(input).not.toHaveAttribute('aria-activedescendant')

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveValue('pu')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', 'from-city-option-1')

    await user.keyboard('{ArrowDown}')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', 'from-city-option-3')

    await user.keyboard('{ArrowUp}')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', 'from-city-option-1')

    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith({ id: 1, name: 'Pune', state: 'Maharashtra' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveValue('Pune')
  })

  it('closes the listbox with Escape without selecting a city', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Harness initialText="pu" onSelect={onSelect} />)

    const input = screen.getByRole('combobox', { name: 'From' })
    input.focus()
    await user.keyboard('{ArrowDown}')

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(input).toHaveValue('pu')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows a single non-selectable "No cities found" option when nothing matches', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Harness initialText="xyz" onSelect={onSelect} />)

    const input = screen.getByRole('combobox', { name: 'From' })
    input.focus()
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('No cities found')
    expect(options[0]).toHaveAttribute('aria-disabled', 'true')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')
    await user.keyboard('{Enter}')

    expect(onSelect).not.toHaveBeenCalled()
    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('renders the error prop as an alert next to the input', () => {
    render(<Harness initialText="pu" error="Select a city from the list" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Select a city from the list')
    expect(screen.getByRole('listbox')).not.toContainElement(alert)
  })
})
