const Book = require('../models/bookModel')

function isFilledString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function validateBook(data = {}) {
  const errors = {}
  const year = Number(data.publication_year)
  const currentYear = new Date().getFullYear()

  if (!isFilledString(data.title)) errors.title = 'Título é obrigatório'
  if (!isFilledString(data.author_name)) errors.author_name = 'Autor é obrigatório'
  if (!Number.isInteger(year) || year < 1 || year > currentYear) {
    errors.publication_year = `Ano deve ser um número inteiro entre 1 e ${currentYear}`
  }
  return Object.keys(errors).length ? errors : null
}

function normalizeBook(data) {
  return {
    title: data.title.trim(),
    author_name: data.author_name.trim(),
    publication_year: Number(data.publication_year)
  }
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

      const newBook = await Book.create(normalizeBook(req.body))
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

      await Book.update(req.params.id, normalizeBook(req.body))
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

