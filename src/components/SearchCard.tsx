import { useState } from 'react'
import { cities as defaultCities } from '../data'
import { classNames } from '../lib/classNames'
import { DAY_OPTIONS, formatDate, getJourneyDay, TODAY_OFFSET } from '../lib/date'
import type { City } from '../types'
import CityCombobox from './CityCombobox'

interface CityFieldState {
  text: string
  cityId: City['id'] | null
}

interface SearchCardProps {
  cities?: City[]
}

interface FieldErrors {
  from?: string
  to?: string
}

const REQUIRED_CITY_ERROR = 'Select a city from the list'
const SAME_CITY_ERROR = 'From and To must be different cities'

function validateFields(from: CityFieldState, to: CityFieldState): FieldErrors {
  const errors: FieldErrors = {}

  if (from.cityId === null) errors.from = REQUIRED_CITY_ERROR
  if (to.cityId === null) errors.to = REQUIRED_CITY_ERROR

  if (from.cityId !== null && to.cityId !== null && from.cityId === to.cityId) {
    errors.from = SAME_CITY_ERROR
    errors.to = SAME_CITY_ERROR
  }

  return errors
}

function SearchCard({ cities = defaultCities }: SearchCardProps) {
  const [today] = useState(() => new Date())
  const [dayOffset, setDayOffset] = useState(TODAY_OFFSET)
  const [forWomen, setForWomen] = useState(false)
  const [from, setFrom] = useState<CityFieldState>({ text: '', cityId: null })
  const [to, setTo] = useState<CityFieldState>({ text: '', cityId: null })
  const [errors, setErrors] = useState<FieldErrors>({})

  const journeyDay = getJourneyDay(today, dayOffset)

  function updateFrom(text: string) {
    setFrom({ text, cityId: null })
    setErrors((current) => ({ ...current, from: undefined }))
  }

  function updateTo(text: string) {
    setTo({ text, cityId: null })
    setErrors((current) => ({ ...current, to: undefined }))
  }

  function selectFrom(city: City) {
    setFrom({ text: city.name, cityId: city.id })
    setErrors((current) => ({ ...current, from: undefined }))
  }

  function selectTo(city: City) {
    setTo({ text: city.name, cityId: city.id })
    setErrors((current) => ({ ...current, to: undefined }))
  }

  function swapCities() {
    setFrom(to)
    setTo(from)
    setErrors({})
  }

  function handleSearch() {
    setErrors(validateFields(from, to))
  }

  return (
    <section className="search-card" aria-label="Search buses">
      <div className="search-row">
        <div className="search-fields">
          <CityCombobox
            id="from-city"
            ariaLabel="From"
            placeholder="From"
            icon="🚌"
            cities={cities}
            text={from.text}
            cityId={from.cityId}
            error={errors.from}
            onChange={updateFrom}
            onSelect={selectFrom}
          />
          <button
            type="button"
            aria-label="Swap From and To"
            className="swap-btn"
            onClick={swapCities}
          >
            ⇄
          </button>
          <CityCombobox
            id="to-city"
            ariaLabel="To"
            placeholder="To"
            icon="🚌"
            cities={cities}
            text={to.text}
            cityId={to.cityId}
            error={errors.to}
            onChange={updateTo}
            onSelect={selectTo}
          />
          <div className="field date-field">
            <span className="field-icon" aria-hidden="true">
              📅
            </span>
            <div className="date-text">
              <small>Date of Journey</small>
              <strong>{formatDate(journeyDay.date)}</strong>
              <em>({journeyDay.label})</em>
            </div>
            {DAY_OPTIONS.map((option) => {
              const isSelected = option.offset === dayOffset
              return (
                <button
                  key={option.offset}
                  type="button"
                  className={classNames('chip', isSelected && 'chip-active')}
                  aria-pressed={isSelected}
                  onClick={() => setDayOffset(option.offset)}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="women-box">
          <span className="women-icon" aria-hidden="true">
            👩
          </span>
          <div>
            <div>Booking for women</div>
            <a href="#">Know more</a>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={forWomen}
            aria-label="Booking for women"
            className={classNames('toggle', forWomen && 'on')}
            onClick={() => setForWomen((isOn) => !isOn)}
          />
        </div>
      </div>
      <button type="button" className="search-btn" onClick={handleSearch}>
        <span aria-hidden="true">⌕</span> Search buses
      </button>
    </section>
  )
}

export default SearchCard
