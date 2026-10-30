module.exports = function (err, req, res, next) {
  // JSON malformado no corpo da requisição
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido no corpo da requisição' })
  }

  // Detalhes do erro ficam apenas no log do servidor, nunca na resposta
  console.error(err.stack)
  res.status(500).json({ message: 'Erro interno no servidor' })
}
