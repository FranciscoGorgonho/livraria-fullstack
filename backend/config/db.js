// Importa o Pool do módulo 'pg' (PostgreSQL)
const { Pool } = require('pg')

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config()

// Cria uma nova instância de Pool para gerenciar conexões com o banco
const pool = new Pool({
  user: process.env.DB_USER,         // Nome de usuário do banco
  host: process.env.DB_HOST,         // Host do banco (geralmente 'localhost')
  database: process.env.DB_DATABASE, // Nome do banco de dados
  password: process.env.DB_PASSWORD, // Senha do banco (colocada no .env)
  port: process.env.DB_PORT          // Porta (padrão do PostgreSQL é 5432)
})

// Testa a conexão imediatamente ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar no banco de dados:', err.stack)
  }
  console.log('Conectado ao banco de dados com sucesso!')
  release()
})

// Exporta o pool para ser usado em outras partes da aplicação
module.exports = pool
