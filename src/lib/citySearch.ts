import type { City } from '../types'

export function filterCities(cities: City[], query: string): City[] {
  const needle = query.trim().toLowerCase()
  if (needle.length === 0) return []

  return cities.filter((city) => city.name.toLowerCase().startsWith(needle))
}
