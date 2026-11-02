// Mensagens para os erros de cliente gerados pelo próprio Express ao ler o corpo
const CLIENT_ERRORS = {
  'entity.parse.failed': 'JSON inválido no corpo da requisição',
  'entity.too.large': 'Corpo da requisição muito grande'
}

module.exports = function (err, req, res, next) {
  if (CLIENT_ERRORS[err.type]) {
    return res.status(err.status || 400).json({ message: CLIENT_ERRORS[err.type] })
  }

  // Detalhes do erro ficam apenas no log do servidor, nunca na resposta
  console.error(err.stack)
  res.status(500).json({ message: 'Erro interno no servidor' })
}
