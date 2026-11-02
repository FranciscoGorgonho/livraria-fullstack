// Utilitário do banco de dados:
//   npm run db:setup  cria o banco (se preciso), as tabelas e os dados de exemplo
//   npm run db:seed   insere apenas os dados de exemplo
//   npm run db:reset  apaga as tabelas e recria tudo do zero
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const DB_DIR = path.join(__dirname, '..', 'db')
const DATABASE = process.env.DB_DATABASE

function createClient(database) {
  return new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database
  })
}

// Conecta no banco padrão "postgres" para criar o banco da aplicação
async function ensureDatabase() {
  const admin = createClient('postgres')
  await admin.connect()
  try {
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [DATABASE])
    if (rowCount) {
      console.log(`• Banco "${DATABASE}" já existe`)
      return
    }
    // Nomes de banco não aceitam parâmetros ($1), então o identificador é escapado
    await admin.query(`CREATE DATABASE "${DATABASE.replace(/"/g, '""')}"`)
    console.log(`✔ Banco "${DATABASE}" criado`)
  } finally {
    await admin.end()
  }
}

async function runFile(client, file) {
  await client.query(fs.readFileSync(path.join(DB_DIR, file), 'utf8'))
}

async function countBooks(client) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS total FROM books')
  return rows[0].total
}

const commands = {
  async setup(client) {
    await runFile(client, 'schema.sql')
    console.log('✔ Tabelas prontas')
    await commands.seed(client)
  },

  async seed(client) {
    const before = await countBooks(client)
    await runFile(client, 'seed.sql')
    const after = await countBooks(client)
    console.log(`✔ Dados de exemplo: ${after - before} livros inseridos (${after} no total)`)
  },

  async reset(client) {
    await client.query('DROP TABLE IF EXISTS books, authors CASCADE')
    console.log('✔ Tabelas removidas')
    await commands.setup(client)
  }
}

function explain(error) {
  // Falhas de conexão chegam como AggregateError, com o código no primeiro erro interno
  const code = error.code || error.errors?.[0]?.code
  if (code === 'ECONNREFUSED') {
    return 'Não foi possível conectar ao PostgreSQL. Verifique se o serviço está rodando e se DB_HOST/DB_PORT estão corretos.'
  }
  if (code === '28P01') {
    return 'Usuário ou senha inválidos. Confira DB_USER e DB_PASSWORD no backend/.env.'
  }
  return error.message
}

async function main() {
  const command = process.argv[2]
  if (!commands[command]) {
    console.error(`Uso: node scripts/db.js <${Object.keys(commands).join('|')}>`)
    process.exit(1)
  }
  if (!DATABASE) {
    console.error('✖ DB_DATABASE não definido. Crie o backend/.env a partir do .env.example.')
    process.exit(1)
  }

  await ensureDatabase()
  const client = createClient(DATABASE)
  await client.connect()
  try {
    await commands[command](client)
  } finally {
    await client.end()
  }
}

main().catch(error => {
  console.error(`✖ ${explain(error)}`)
  process.exitCode = 1
})
