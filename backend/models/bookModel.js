const db = require('../config/db')

const SELECT_BOOKS = `
  SELECT books.id, books.title, books.publication_year, authors.name AS author
  FROM books
  JOIN authors ON books.author_id = authors.id
`

// Executa as queries em uma única transação, desfazendo tudo em caso de erro
async function withTransaction(callback) {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function findOrCreateAuthor(client, name) {
  const existing = await client.query('SELECT id FROM authors WHERE name = $1', [name])
  if (existing.rows.length) return existing.rows[0].id

  const created = await client.query(
    'INSERT INTO authors (name) VALUES ($1) RETURNING id', [name]
  )
  return created.rows[0].id
}

module.exports = {
  async getAll() {
    const result = await db.query(`${SELECT_BOOKS} ORDER BY books.id DESC`)
    return result.rows
  },

  async getById(id) {
    const result = await db.query(`${SELECT_BOOKS} WHERE books.id = $1`, [id])
    return result.rows[0]
  },

  async create({ title, publication_year, author_name }) {
    return withTransaction(async client => {
      const authorId = await findOrCreateAuthor(client, author_name)
      const result = await client.query(
        'INSERT INTO books (title, publication_year, author_id) VALUES ($1, $2, $3) RETURNING *',
        [title, publication_year, authorId]
      )
      return result.rows[0]
    })
  },

  async update(id, { title, publication_year, author_name }) {
    return withTransaction(async client => {
      const authorId = await findOrCreateAuthor(client, author_name)
      await client.query(
        'UPDATE books SET title=$1, publication_year=$2, author_id=$3 WHERE id=$4',
        [title, publication_year, authorId, id]
      )
    })
  },

  async remove(id) {
    await db.query('DELETE FROM books WHERE id=$1', [id])
  }
}
