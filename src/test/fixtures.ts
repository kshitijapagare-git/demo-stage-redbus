import type { BoardingPoint, City, Offer } from '../types'

export const testCities: City[] = [{ id: 1, name: 'Pune', state: 'Maharashtra' }]

export const testCityOptions: City[] = [
  { id: 1, name: 'Pune', state: 'Maharashtra' },
  { id: 2, name: 'Bengaluru', state: 'Karnataka' },
]

export const testBoardingPoints: BoardingPoint[] = [
  { id: 1, name: 'Shivajinagar', address: 'FC Road', landmark: 'Near Modern Cafe', cityId: 1 },
]

export const testOffers: Offer[] = [
  { title: 'Save up to Rs 300 on bus tickets', valid: '05 Oct', code: 'FESTIVE300', tone: 'peach' },
  {
    title: 'Save up to Rs 200 on Primo operators.',
    valid: '31 Oct',
    code: 'PRIMODAY',
    tone: 'yellow',
  },
]
