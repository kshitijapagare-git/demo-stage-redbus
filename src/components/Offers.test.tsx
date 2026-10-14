import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Offers from './Offers'
import { testOffers } from '../test/fixtures'

describe('Offers', () => {
  it('renders one card per offer with its title, validity and code', () => {
    render(<Offers offers={testOffers} />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveTextContent('Save up to Rs 300 on bus tickets')
    expect(cards[0]).toHaveTextContent('Valid till 05 Oct')
    expect(cards[0]).toHaveTextContent('FESTIVE300')
  })

  it('applies the tone as a CSS modifier class', () => {
    render(<Offers offers={testOffers} />)
    expect(screen.getAllByRole('article')[1]).toHaveClass('offer', 'offer-yellow')
  })

  it('renders the sample offers by default', () => {
    render(<Offers />)
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })
})
