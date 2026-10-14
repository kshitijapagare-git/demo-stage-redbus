import { useState } from 'react'
import { classNames } from '../lib/classNames'
import { DAY_OPTIONS, formatDate, getJourneyDay, TODAY_OFFSET } from '../lib/date'

function SearchCard() {
  const [today] = useState(() => new Date())
  const [dayOffset, setDayOffset] = useState(TODAY_OFFSET)
  const [forWomen, setForWomen] = useState(false)

  const journeyDay = getJourneyDay(today, dayOffset)

  return (
    <section className="search-card" aria-label="Search buses">
      <div className="search-row">
        <div className="search-fields">
          <label className="field">
            <span className="field-icon" aria-hidden="true">
              🚌
            </span>
            <input placeholder="From" aria-label="From" />
          </label>
          <label className="field">
            <span className="field-icon" aria-hidden="true">
              🚌
            </span>
            <input placeholder="To" aria-label="To" />
          </label>
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
      <button type="button" className="search-btn">
        <span aria-hidden="true">⌕</span> Search buses
      </button>
    </section>
  )
}

export default SearchCard
