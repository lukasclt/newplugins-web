import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/products', label: 'Produtos' },
  { to: '/plans', label: 'Planos' },
  { to: '/market', label: 'Mercado' },
  { to: '/team', label: 'Equipe' },
  { to: '/utils/generate-text', label: 'Utilitários' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="leaf">❦</span>
          NewPlugins
        </Link>

        <nav className={`nav ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="https://docs.leafdelta.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Documentação
          </a>
          <Link to="/dashboard" className="cta" onClick={() => setOpen(false)}>
            Área do Cliente
          </Link>
        </nav>

        <button
          className="menu-btn"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
    </header>
  )
}
