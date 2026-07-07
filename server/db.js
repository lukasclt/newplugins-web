import 'dotenv/config'
import postgres from 'postgres'

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL

const globalForDb = globalThis
export const sql =
  globalForDb.__newpluginsSql ??
  postgres(connectionString, {
    ssl: { rejectUnauthorized: false },
    max: 10,
  })
if (process.env.NODE_ENV !== 'production') globalForDb.__newpluginsSql = sql

const TABLES = [
  `CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    suffix TEXT DEFAULT ''
  );`,
  `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_free INTEGER NOT NULL DEFAULT 0,
    version TEXT NOT NULL DEFAULT '1.0.0',
    downloads INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 5.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    interval TEXT NOT NULL DEFAULT 'monthly',
    highlight INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS plan_products (
    plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, product_id)
  );`,
  `CREATE TABLE IF NOT EXISTS market_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#3ddc97',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
]

export async function migrate() {
  for (const stmt of TABLES) {
    await sql.unsafe(stmt)
  }
}

export async function seed() {
  const [{ c }] = await sql`SELECT COUNT(*)::int AS c FROM products`
  if (c > 0) return

  const stats = [
    ['Usuários', '1000', '+'],
    ['Licenças emitidas', '1.2k', '+'],
    ['Vendas realizadas', '750', '+'],
  ]
  for (const [label, value, suffix] of stats) {
    await sql`INSERT INTO stats (label, value, suffix) VALUES (${label}, ${value}, ${suffix})`
  }

  const products = [
    { name: 'LeafCore', slug: 'leafcore', description: 'Núcleo de gerenciamento de plugins com API unificada e carregamento seguro.', category: 'Sistema', price_cents: 0, is_free: 1, version: '3.4.1', downloads: 18200, rating: 4.9 },
    { name: 'EconomyPlus', slug: 'economyplus', description: 'Sistema econômico completo com bancos, lojas e moedas virtuais.', category: 'Economia', price_cents: 2990, is_free: 0, version: '2.1.0', downloads: 9400, rating: 4.8 },
    { name: 'WorldGuardian', slug: 'worldguardian', description: 'Proteção de regiões, flags avançadas e anti-grief em tempo real.', category: 'Proteção', price_cents: 1990, is_free: 0, version: '1.9.2', downloads: 12300, rating: 4.7 },
    { name: 'KitsPro', slug: 'kitspro', description: 'Kits diários, semanais e por permissão com interface moderna.', category: 'Utilitário', price_cents: 0, is_free: 1, version: '1.2.0', downloads: 7600, rating: 4.6 },
    { name: 'ChatEmotes', slug: 'chatemotes', description: 'Emojis, emotes e formatação rica no chat com PlaceholderAPI.', category: 'Social', price_cents: 990, is_free: 0, version: '1.0.5', downloads: 5100, rating: 4.5 },
    { name: 'MapaVivo', slug: 'mapavivo', description: 'Mapas dinâmicos em tempo real renderizados via web.', category: 'Mapa', price_cents: 3990, is_free: 0, version: '2.0.3', downloads: 3300, rating: 4.9 },
  ]
  const productIds = []
  for (const p of products) {
    const [row] = await sql`INSERT INTO products (name, slug, description, category, price_cents, is_free, version, downloads, rating)
      VALUES (${p.name}, ${p.slug}, ${p.description}, ${p.category}, ${p.price_cents}, ${p.is_free}, ${p.version}, ${p.downloads}, ${p.rating})
      RETURNING id`
    productIds.push(row.id)
  }

  const plans = [
    { name: 'Iniciante', slug: 'iniciante', description: 'Ideal para servidores pequenos começando do zero.', price_cents: 1990, interval: 'monthly', highlight: 0 },
    { name: 'Profissional', slug: 'profissional', description: 'O pacote mais popular com todos os plugins premium.', price_cents: 4990, interval: 'monthly', highlight: 1 },
    { name: 'Estúdio', slug: 'estudio', description: 'Acesso completo + suporte prioritário e mapas exclusivos.', price_cents: 9990, interval: 'monthly', highlight: 0 },
  ]
  const planIds = []
  for (const plan of plans) {
    const [row] = await sql`INSERT INTO plans (name, slug, description, price_cents, interval, highlight)
      VALUES (${plan.name}, ${plan.slug}, ${plan.description}, ${plan.price_cents}, ${plan.interval}, ${plan.highlight})
      RETURNING id`
    planIds.push(row.id)
  }

  for (let i = 0; i < planIds.length; i++) {
    const planId = planIds[i]
    if (i === 0) {
      await sql`INSERT INTO plan_products (plan_id, product_id) VALUES (${planId}, ${productIds[0]}) ON CONFLICT DO NOTHING`
      await sql`INSERT INTO plan_products (plan_id, product_id) VALUES (${planId}, ${productIds[3]}) ON CONFLICT DO NOTHING`
    } else {
      for (const pid of productIds) {
        await sql`INSERT INTO plan_products (plan_id, product_id) VALUES (${planId}, ${pid}) ON CONFLICT DO NOTHING`
      }
    }
  }

  const market = [
    { title: 'Pack de Texturas Pixel', description: 'Texturas 16x com tema floresta para itens e blocos.', category: 'Textura', price_cents: 1490, author: 'Nina' },
    { title: 'Bot de Discord Moderador', description: 'Bot pronto com moderação, logs e comandos custom.', category: 'Bot', price_cents: 2490, author: 'Caio' },
    { title: 'Config de Spawn Premium', description: 'Spawn.yaml otimizado com NPCs e rotas de teleporte.', category: 'Config', price_cents: 0, author: 'Léo' },
    { title: 'API de Rankings', description: 'API REST para exibir rankings do seu servidor em qualquer site.', category: 'API', price_cents: 1990, author: 'Flávio' },
    { title: 'Painel de Vendas', description: 'Painel web para gerenciar cobranças e entregar licenças.', category: 'Painel', price_cents: 3990, author: 'Marina' },
  ]
  for (const m of market) {
    await sql`INSERT INTO market_items (title, description, category, price_cents, author)
      VALUES (${m.title}, ${m.description}, ${m.category}, ${m.price_cents}, ${m.author})`
  }

  const team = [
    { name: 'Flávio Soares', role: 'Fundador & CEO', bio: 'Lidera a visão da NewPlugins e cuida das integrações e APIs.', avatar_color: '#3ddc97' },
    { name: 'Marina Luz', role: 'Designer de Produto', bio: 'Cria identidades visuais e interfaces premium para os produtos.', avatar_color: '#7c5cff' },
    { name: 'Caio Mendes', role: 'Engenheiro de Software', bio: 'Desenvolve os bots, painéis e sistemas internos.', avatar_color: '#ff7a59' },
    { name: 'Nina Cardoso', role: 'Artista 2D/3D', bio: 'Produz texturas, mapas e arte conceitual para os plugins.', avatar_color: '#ff5fa2' },
    { name: 'Léo Tavares', role: 'Suporte & Comunidade', bio: 'Mantém a comunidade funcionando e responde rápido no Discord.', avatar_color: '#36c5f0' },
  ]
  for (const t of team) {
    await sql`INSERT INTO team_members (name, role, bio, avatar_color)
      VALUES (${t.name}, ${t.role}, ${t.bio}, ${t.avatar_color})`
  }
}

await migrate()
await seed()

export default sql
