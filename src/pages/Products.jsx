import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getProducts()
      .then((d) => setItems(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <div className="page-head">
        <h1>Produtos</h1>
        <p>Loja de plugins Minecraft e produtos premium prontos para produção.</p>
      </div>

      {loading && <div className="loading">Carregando produtos...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        {items.map((p) => (
          <article className="card" key={p.id}>
            <span className="tag">{p.category}</span>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="meta">
              <span className={`price ${p.is_free ? 'free' : ''}`}>
                {p.is_free ? 'Grátis' : p.price}
              </span>
              <span className="rating">★ {p.rating.toFixed(1)}</span>
            </div>
            <div className="meta" style={{ color: 'var(--text-dim)' }}>
              <span>v{p.version}</span>
              <span>{p.downloads.toLocaleString('pt-BR')} downloads</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
