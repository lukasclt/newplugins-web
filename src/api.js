const BASE = '/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
  return data
}

export const api = {
  getStats: () => get('/stats'),
  getProducts: () => get('/products'),
  getPlans: () => get('/plans'),
  getMarket: () => get('/market'),
  getTeam: () => get('/team'),
  generateText: (prompt) => post('/utils/generate-text', { prompt }),
}
