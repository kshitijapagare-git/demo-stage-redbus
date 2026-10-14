import { offers as defaultOffers } from '../data'
import { classNames } from '../lib/classNames'
import type { Offer, OfferTone } from '../types'

const OFFER_TABS = ['All', 'Bus', 'Train'] as const
const ACTIVE_TAB: (typeof OFFER_TABS)[number] = 'All'

const TONE_CLASS: Record<OfferTone, string> = {
  peach: 'offer-peach',
  pink: 'offer-pink',
  yellow: 'offer-yellow',
}

interface OffersProps {
  offers?: Offer[]
}

function Offers({ offers = defaultOffers }: OffersProps) {
  return (
    <section className="container section" aria-labelledby="offers-heading">
      <div className="section-head">
        <h2 id="offers-heading">Offers for you</h2>
        <a href="#">View more</a>
      </div>
      <div className="tabs">
        {OFFER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={classNames('tab', tab === ACTIVE_TAB && 'active')}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="offer-grid">
        {offers.map((offer) => (
          <article key={offer.code} className={classNames('offer', TONE_CLASS[offer.tone])}>
            <span className="badge">Bus</span>
            <h3>{offer.title}</h3>
            <p>Valid till {offer.valid}</p>
            <span className="code">
              <span aria-hidden="true">🏷</span> {offer.code}
            </span>
            <span className="offer-art" aria-hidden="true">
              🚌
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Offers
