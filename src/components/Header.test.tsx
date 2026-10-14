import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('marks Bus tickets as the current page', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Bus tickets' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Hotels' })).not.toHaveAttribute('aria-current')
  })

  it('hides decorative icons from assistive technology', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Bookings' })).toBeInTheDocument()
  })
})
