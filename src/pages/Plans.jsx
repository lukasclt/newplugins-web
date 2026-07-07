import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getPlans()
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <div className="page-head">
        <h1>Planos</h1>
        <p>
          Cada plano é um pacote de produtos. Ao pagar, o usuário recebe acesso
          aos produtos vinculados enquanto a assinatura estiver ativa.
        </p>
      </div>

      {loading && <div className="loading">Carregando os planos...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        {plans.map((plan) => (
          <div className={`plan ${plan.highlight ? 'highlight' : ''}`} key={plan.id}>
            {plan.highlight && <span className="pill">Mais popular</span>}
            <h3>{plan.name}</h3>
            <p style={{ color: 'var(--text-dim)', margin: 0 }}>{plan.description}</p>
            <div className="price">
              {plan.price} <small>/ {plan.interval === 'monthly' ? 'mês' : plan.interval}</small>
            </div>
            <ul>
              {plan.products.map((prod) => (
                <li key={prod.id}>
                  {prod.name} {prod.is_free ? '(grátis)' : ''}
                </li>
              ))}
            </ul>
            <button className="btn">Assinar {plan.name}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
