import 'dotenv/config'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING, {
  ssl: { rejectUnauthorized: false },
})

const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`

console.log(`Dropping ${tables.length} table(s)...`)
for (const { table_name } of tables) {
  await sql.unsafe(`DROP TABLE IF EXISTS "${table_name}" CASCADE`)
  console.log('  dropped', table_name)
}

await sql.end()
console.log('Done. Start the server to recreate and seed the schema.')
process.exit(0)
