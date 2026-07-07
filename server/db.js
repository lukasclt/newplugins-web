import { createClient } from '@libsql/client'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.TURSO_DATABASE_URL || `file:${join(__dirname, 'turso.db')}`
const authToken = process.env.TURSO_AUTH_TOKEN

export const client = createClient({ url, authToken })

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    suffix TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_free INTEGER NOT NULL DEFAULT 0,
    version TEXT NOT NULL DEFAULT '1.0.0',
    downloads INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 5.0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    interval TEXT NOT NULL DEFAULT 'monthly',
    highlight INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS plan_products (
    plan_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (plan_id, product_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS market_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#3ddc97',
    joined_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`

await client.executeMultiple(SCHEMA)
await client.execute('PRAGMA foreign_keys = ON')

async function seed() {
  const { rows } = await client.execute('SELECT COUNT(*) AS c FROM products')
  if (Number(rows[0].c) > 0) return

  await client.batch(
    [
      ...[
        ['Usuários', '1000', '+'],
        ['Licenças emitidas', '1.2k', '+'],
        ['Vendas realizadas', '750', '+'],
      ].map((s) => ({
        sql: 'INSERT INTO stats (label, value, suffix) VALUES (?, ?, ?)',
        args: s,
      })),

      ...[
        { name: 'LeafCore', slug: 'leafcore', description: 'Núcleo de gerenciamento de plugins com API unificada e carregamento seguro.', category: 'Sistema', price_cents: 0, is_free: 1, version: '3.4.1', downloads: 18200, rating: 4.9 },
        { name: 'EconomyPlus', slug: 'economyplus', description: 'Sistema econômico completo com bancos, lojas e moedas virtuais.', category: 'Economia', price_cents: 2990, is_free: 0, version: '2.1.0', downloads: 9400, rating: 4.8 },
        { name: 'WorldGuardian', slug: 'worldguardian', description: 'Proteção de regiões, flags avançadas e anti-grief em tempo real.', category: 'Proteção', price_cents: 1990, is_free: 0, version: '1.9.2', downloads: 12300, rating: 4.7 },
        { name: 'KitsPro', slug: 'kitspro', description: 'Kits diários, semanais e por permissão com interface moderna.', category: 'Utilitário', price_cents: 0, is_free: 1, version: '1.2.0', downloads: 7600, rating: 4.6 },
        { name: 'ChatEmotes', slug: 'chatemotes', description: 'Emojis, emotes e formatação rica no chat com PlaceholderAPI.', category: 'Social', price_cents: 990, is_free: 0, version: '1.0.5', downloads: 5100, rating: 4.5 },
        { name: 'MapaVivo', slug: 'mapavivo', description: 'Mapas dinâmicos em tempo real renderizados via web.', category: 'Mapa', price_cents: 3990, is_free: 0, version: '2.0.3', downloads: 3300, rating: 4.9 },
      ].map((p) => ({
        sql: 'INSERT INTO products (name, slug, description, category, price_cents, is_free, version, downloads, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [p.name, p.slug, p.description, p.category, p.price_cents, p.is_free, p.version, p.downloads, p.rating],
      })),

      ...[
        { name: 'Iniciante', slug: 'iniciante', description: 'Ideal para servidores pequenos começando do zero.', price_cents: 1990, interval: 'monthly', highlight: 0 },
        { name: 'Profissional', slug: 'profissional', description: 'O pacote mais popular com todos os plugins premium.', price_cents: 4990, interval: 'monthly', highlight: 1 },
        { name: 'Estúdio', slug: 'estudio', description: 'Acesso completo + suporte prioritário e mapas exclusivos.', price_cents: 9990, interval: 'monthly', highlight: 0 },
      ].map((plan) => ({
        sql: 'INSERT INTO plans (name, slug, description, price_cents, interval, highlight) VALUES (?, ?, ?, ?, ?, ?)',
        args: [plan.name, plan.slug, plan.description, plan.price_cents, plan.interval, plan.highlight],
      })),

      ...[
        { title: 'Pack de Texturas Pixel', description: 'Texturas 16x com tema floresta para itens e blocos.', category: 'Textura', price_cents: 1490, author: 'Nina' },
        { title: 'Bot de Discord Moderador', description: 'Bot pronto com moderação, logs e comandos custom.', category: 'Bot', price_cents: 2490, author: 'Caio' },
        { title: 'Config de Spawn Premium', description: 'Spawn.yaml otimizado com NPCs e rotas de teleporte.', category: 'Config', price_cents: 0, author: 'Léo' },
        { title: 'API de Rankings', description: 'API REST para exibir rankings do seu servidor em qualquer site.', category: 'API', price_cents: 1990, author: 'Flávio' },
        { title: 'Painel de Vendas', description: 'Painel web para gerenciar cobranças e entregar licenças.', category: 'Painel', price_cents: 3990, author: 'Marina' },
      ].map((m) => ({
        sql: 'INSERT INTO market_items (title, description, category, price_cents, author) VALUES (?, ?, ?, ?, ?)',
        args: [m.title, m.description, m.category, m.price_cents, m.author],
      })),

      ...[
        { name: 'Flávio Soares', role: 'Fundador & CEO', bio: 'Lidera a visão da NewPlugins e cuida das integrações e APIs.', avatar_color: '#3ddc97' },
        { name: 'Marina Luz', role: 'Designer de Produto', bio: 'Cria identidades visuais e interfaces premium para os produtos.', avatar_color: '#7c5cff' },
        { name: 'Caio Mendes', role: 'Engenheiro de Software', bio: 'Desenvolve os bots, painéis e sistemas internos.', avatar_color: '#ff7a59' },
        { name: 'Nina Cardoso', role: 'Artista 2D/3D', bio: 'Produz texturas, mapas e arte conceitual para os plugins.', avatar_color: '#ff5fa2' },
        { name: 'Léo Tavares', role: 'Suporte & Comunidade', bio: 'Mantém a comunidade funcionando e responde rápido no Discord.', avatar_color: '#36c5f0' },
      ].map((t) => ({
        sql: 'INSERT INTO team_members (name, role, bio, avatar_color) VALUES (?, ?, ?, ?)',
        args: [t.name, t.role, t.bio, t.avatar_color],
      })),
    ],
    'write',
  )

  const planIds = await client.execute('SELECT id FROM plans ORDER BY id')
  const productIds = await client.execute('SELECT id FROM products ORDER BY id')
  const linkStatements = []
  planIds.rows.forEach((plan, i) => {
    if (i === 0) {
      linkStatements.push({ sql: 'INSERT OR IGNORE INTO plan_products (plan_id, product_id) VALUES (?, ?)', args: [plan.id, productIds.rows[0].id] })
      linkStatements.push({ sql: 'INSERT OR IGNORE INTO plan_products (plan_id, product_id) VALUES (?, ?)', args: [plan.id, productIds.rows[3].id] })
    } else {
      productIds.rows.forEach((p) =>
        linkStatements.push({ sql: 'INSERT OR IGNORE INTO plan_products (plan_id, product_id) VALUES (?, ?)', args: [plan.id, p.id] }),
      )
    }
  })
  if (linkStatements.length) await client.batch(linkStatements, 'write')
}

await seed()

export default client
