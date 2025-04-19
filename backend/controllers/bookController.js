const Book = require('../models/bookModel')

function validateBook(data) {
  const errors = {}
  if (!data.title || data.title.trim() === '') errors.title = 'Título é obrigatório'
  if (!data.author_name || data.author_name.trim() === '') errors.author_name = 'Autor é obrigatório'
  if (!data.publication_year || isNaN(data.publication_year)) errors.publication_year = 'Ano válido é obrigatório'
  return Object.keys(errors).length ? errors : null
}

module.exports = {
  async list(req, res, next) {
    try {
      const books = await Book.getAll()
      res.json(books)
    } catch (error) {
      next(error)
    }
  },

  async get(req, res, next) {
    try {
      const book = await Book.getById(req.params.id)
      if (!book) {
        return res.status(404).json({ message: 'Livro não encontrado' })
      }
      res.json(book)
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const errors = validateBook(req.body)
      if (errors) return res.status(400).json({ errors })

      const newBook = await Book.create(req.body)
      res.status(201).json(newBook)
    } catch (error) {
      next(error)
    }
  },

  async update(req, res, next) {
    try {
      const errors = validateBook(req.body)
      if (errors) return res.status(400).json({ errors })

      const existingBook = await Book.getById(req.params.id)
      if (!existingBook) {
        return res.status(404).json({ message: 'Livro não encontrado' })
      }

      await Book.update(req.params.id, req.body)
      res.json({ message: 'Livro atualizado com sucesso' })
    } catch (error) {
      next(error)
    }
  },

  async delete(req, res, next) {
    try {
      const existingBook = await Book.getById(req.params.id)
      if (!existingBook) {
        return res.status(404).json({ message: 'Livro não encontrado' })
      }

      await Book.remove(req.params.id)
      res.json({ message: 'Livro excluído com sucesso' })
    } catch (error) {
      next(error)
    }
  }
}

