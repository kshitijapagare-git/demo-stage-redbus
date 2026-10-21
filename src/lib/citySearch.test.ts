import { describe, expect, it } from 'vitest'
import type { City } from '../types'
import { filterCities } from './citySearch'

const searchCities: City[] = [
  { id: 1, name: 'Pune', state: 'Maharashtra' },
  { id: 2, name: 'Bengaluru', state: 'Karnataka' },
  { id: 3, name: 'Puducherry', state: 'Puducherry' },
]

describe('filterCities', () => {
  it('matches the prefix of the city name', () => {
    expect(filterCities(searchCities, 'pu')).toEqual([
      { id: 1, name: 'Pune', state: 'Maharashtra' },
      { id: 3, name: 'Puducherry', state: 'Puducherry' },
    ])
  })

  it('matches case-insensitively', () => {
    expect(filterCities(searchCities, 'Pu')).toEqual(filterCities(searchCities, 'pu'))
    expect(filterCities(searchCities, 'PU')).toEqual(filterCities(searchCities, 'pu'))
  })

  it('does not match on an infix', () => {
    expect(filterCities(searchCities, 'une')).toEqual([])
  })

  it('returns nothing for an empty or whitespace-only query', () => {
    expect(filterCities(searchCities, '')).toEqual([])
    expect(filterCities(searchCities, '   ')).toEqual([])
  })

  it('returns an empty list when no city matches', () => {
    expect(filterCities(searchCities, 'xyz')).toEqual([])
  })

  it('preserves the order of the cities argument', () => {
    const reversed = [...searchCities].reverse()
    expect(filterCities(reversed, 'pu').map((city) => city.id)).toEqual([3, 1])
  })
})
