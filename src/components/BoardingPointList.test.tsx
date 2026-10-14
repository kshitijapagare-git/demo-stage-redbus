import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BoardingPointList from './BoardingPointList'
import { testBoardingPoints, testCities } from '../test/fixtures'

describe('BoardingPointList', () => {
  it('renders each boarding point with its fields', () => {
    render(<BoardingPointList cities={testCities} boardingPoints={testBoardingPoints} />)
    const item = screen.getByRole('listitem')
    expect(item).toHaveTextContent('Shivajinagar')
    expect(item).toHaveTextContent('FC Road')
    expect(item).toHaveTextContent('Near Modern Cafe')
  })

  it('resolves cityId to the city name and state', () => {
    render(<BoardingPointList cities={testCities} boardingPoints={testBoardingPoints} />)
    expect(screen.getByRole('listitem')).toHaveTextContent('(Pune, Maharashtra)')
  })

  it('omits the city label when the city is unknown', () => {
    render(<BoardingPointList cities={[]} boardingPoints={testBoardingPoints} />)
    expect(screen.getByRole('listitem')).not.toHaveTextContent('(')
  })
})
