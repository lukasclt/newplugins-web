import express from 'express'
import { client } from './db.js'

const app = express()

app.use(express.json())

const formatPrice = (cents) =>
  (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

app.get('/api/stats', async (_req, res) => {
  const { rows } = await client.execute('SELECT label, value, suffix FROM stats')
  res.json(rows)
})

app.get('/api/products', async (_req, res) => {
  const { rows } = await client.execute('SELECT * FROM products ORDER BY downloads DESC')
  res.json(rows.map((p) => ({ ...p, price: formatPrice(p.price_cents) })))
})

app.get('/api/products/:slug', async (req, res) => {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM products WHERE slug = ?',
    args: [req.params.slug],
  })
  if (!rows.length) return res.status(404).json({ error: 'not found' })
  res.json({ ...rows[0], price: formatPrice(rows[0].price_cents) })
})

app.get('/api/plans', async (_req, res) => {
  const { rows: plans } = await client.execute('SELECT * FROM plans ORDER BY price_cents ASC')
  const withProducts = await Promise.all(
    plans.map(async (plan) => {
      const { rows: items } = await client.execute({
        sql: `SELECT p.* FROM products p
              JOIN plan_products pp ON pp.product_id = p.id
              WHERE pp.plan_id = ?
              ORDER BY p.name`,
        args: [plan.id],
      })
      return {
        ...plan,
        price: formatPrice(plan.price_cents),
        products: items.map((p) => ({ ...p, price: formatPrice(p.price_cents) })),
      }
    }),
  )
  res.json(withProducts)
})

app.get('/api/market', async (_req, res) => {
  const { rows } = await client.execute('SELECT * FROM market_items ORDER BY created_at DESC')
  res.json(rows.map((m) => ({ ...m, price: formatPrice(m.price_cents) })))
})

app.get('/api/team', async (_req, res) => {
  const { rows } = await client.execute('SELECT * FROM team_members ORDER BY id')
  res.json(rows)
})

const SNIPPETS = [
  'Otimize seu servidor com recursos que realmente importam para a comunidade.',
  'Crie experiências memoráveis com plugins premium e suporte dedicado.',
  'Transforme ideias em sistemas funcionais prontos para produção.',
  'Eleve a qualidade do seu projeto com padrões profissionais e validados.',
  'Conecte seu servidor ao mundo com APIs, painéis e integrações inteligentes.',
]

app.post('/api/utils/generate-text', async (req, res) => {
  const prompt = (req.body?.prompt || '').toString().trim()
  if (!prompt) return res.status(400).json({ error: 'Informe um prompt.' })
  const base = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
  const text = `Sugestão gerada para "${prompt}": ${base}`
  res.json({ text, created_at: new Date().toISOString() })
})

app.get('/api/health', async (_req, res) => {
  await client.execute('SELECT 1')
  res.json({ ok: true })
})

export default app
