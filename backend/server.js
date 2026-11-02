const path = require('path')
const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const bookRoutes = require('./routes/bookRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/books', bookRoutes)

// Serve o frontend na mesma porta da API: um único comando sobe a aplicação
app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.use(errorHandler) // Middleware de tratamento de erro

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
