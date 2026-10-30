const express = require('express')
const router = express.Router()
const controller = require('../controllers/bookController')

// Rejeita IDs que não sejam inteiros positivos antes de chegar ao banco
router.param('id', (req, res, next, id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  next()
})

router.get('/', controller.list)
router.get('/:id', controller.get)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
