import { classNames } from '../lib/classNames'

interface NavLink {
  label: string
  icon: string
  isActive?: boolean
}

const MAIN_LINKS: NavLink[] = [
  { label: 'Bus tickets', icon: '🚌', isActive: true },
  { label: 'Train tickets', icon: '🚆' },
  { label: 'Hotels', icon: '🛏️' },
]

const SIDE_LINKS: NavLink[] = [
  { label: 'Bookings', icon: '☰' },
  { label: 'Help', icon: 'ⓘ' },
  { label: 'Account', icon: '◉' },
]

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">redBus</div>
        <nav className="nav-main" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.label}
              className={classNames('nav-item', link.isActive && 'active')}
              href="#"
              aria-current={link.isActive ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {link.icon}
              </span>
              {link.label}
            </a>
          ))}
        </nav>
        <nav className="nav-side" aria-label="Account">
          {SIDE_LINKS.map((link) => (
            <a key={link.label} href="#">
              <span aria-hidden="true">{link.icon}</span> {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
