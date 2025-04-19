const pool = require('./db')

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao fazer consulta:', err)
  } else {
    console.log('Banco de dados respondeu com:', res.rows[0])
  }
  pool.end()
})
