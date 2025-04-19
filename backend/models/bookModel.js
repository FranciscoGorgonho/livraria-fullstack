const db = require('../config/db')

module.exports = {
  async getAll() {
    const result = await db.query(`
      SELECT books.id, books.title, books.publication_year, authors.name AS author
      FROM books
      JOIN authors ON books.author_id = authors.id
      ORDER BY books.id DESC
    `)
    return result.rows
  },

  async getById(id) {
    const result = await db.query(`
      SELECT books.id, books.title, books.publication_year, authors.name AS author
      FROM books
      JOIN authors ON books.author_id = authors.id
      WHERE books.id = $1
    `, [id])
    return result.rows[0]
  },

  async create({ title, publication_year, author_name }) {
    const authorResult = await db.query(
      'SELECT id FROM authors WHERE name = $1', [author_name]
    )

    let authorId = authorResult.rows.length ? authorResult.rows[0].id : null

    if (!authorId) {
      const newAuthor = await db.query(
        'INSERT INTO authors (name) VALUES ($1) RETURNING id', [author_name]
      )
      authorId = newAuthor.rows[0].id
    }

    const result = await db.query(
      'INSERT INTO books (title, publication_year, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, publication_year, authorId]
    )
    return result.rows[0]
  },

  async update(id, { title, publication_year, author_name }) {
    const authorResult = await db.query(
      'SELECT id FROM authors WHERE name = $1', [author_name]
    )

    let authorId = authorResult.rows.length ? authorResult.rows[0].id : null

    if (!authorId) {
      const newAuthor = await db.query(
        'INSERT INTO authors (name) VALUES ($1) RETURNING id', [author_name]
      )
      authorId = newAuthor.rows[0].id
    }

    await db.query(
      'UPDATE books SET title=$1, publication_year=$2, author_id=$3 WHERE id=$4',
      [title, publication_year, authorId, id]
    )
  },

  async remove(id) {
    await db.query('DELETE FROM books WHERE id=$1', [id])
  }
}
