import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Market() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getMarket()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <div className="page-head">
        <h1>Mercado</h1>
        <p>
          Texturas, bots, configs, APIs e painéis criados pela comunidade e pelo
          estúdio.
        </p>
      </div>

      {loading && <div className="loading">Carregando o mercado...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        {items.map((m) => (
          <article className="card" key={m.id}>
            <span className="tag">{m.category}</span>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <div className="meta">
              <span className={`price ${m.price_cents === 0 ? 'free' : ''}`}>
                {m.price_cents === 0 ? 'Grátis' : m.price}
              </span>
              <span style={{ color: 'var(--text-dim)' }}>por {m.author}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
