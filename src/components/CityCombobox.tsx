import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { classNames } from '../lib/classNames'
import { filterCities } from '../lib/citySearch'
import type { City } from '../types'

interface CityComboboxProps {
  id: string
  ariaLabel: string
  placeholder: string
  icon: string
  cities: City[]
  text: string
  cityId: City['id'] | null
  error?: string
  onChange: (text: string) => void
  onSelect: (city: City) => void
}

function CityCombobox({
  id,
  ariaLabel,
  placeholder,
  icon,
  cities,
  text,
  cityId,
  error,
  onChange,
  onSelect,
}: CityComboboxProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = filterCities(cities, text)
  const showList = isOpen && text.trim().length > 0
  const highlightedIndex = activeIndex >= 0 && activeIndex < suggestions.length ? activeIndex : -1
  const highlightedCity = highlightedIndex >= 0 ? suggestions[highlightedIndex] : undefined

  const listboxId = `${id}-listbox`
  const errorId = `${id}-error`

  function closeList() {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function selectCity(city: City) {
    onSelect(city)
    closeList()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
    setActiveIndex(-1)
    setIsOpen(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      closeList()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (suggestions.length === 0) return
      event.preventDefault()
      setIsOpen(true)
      if (event.key === 'ArrowDown') {
        setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
      } else {
        setActiveIndex((index) => Math.max(index - 1, 0))
      }
      return
    }

    if (event.key === 'Enter' && highlightedCity) {
      event.preventDefault()
      selectCity(highlightedCity)
    }
  }

  return (
    <div className="field combobox" data-city-id={cityId ?? undefined}>
      <span className="field-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="combobox-body">
        <input
          id={id}
          type="text"
          role="combobox"
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-expanded={showList}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            showList && highlightedCity ? `${id}-option-${highlightedCity.id}` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {error && (
          <span className="field-error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </div>
      {showList && (
        <ul className="combobox-listbox" role="listbox" id={listboxId}>
          {suggestions.length === 0 ? (
            <li
              className="combobox-option combobox-empty"
              role="option"
              aria-disabled="true"
              aria-selected={false}
            >
              No cities found
            </li>
          ) : (
            suggestions.map((city, index) => (
              <li
                key={city.id}
                id={`${id}-option-${city.id}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={classNames(
                  'combobox-option',
                  index === highlightedIndex && 'combobox-option-active',
                )}
                onClick={() => selectCity(city)}
              >
                {city.name}
                <span className="combobox-option-state">{city.state}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default CityCombobox
