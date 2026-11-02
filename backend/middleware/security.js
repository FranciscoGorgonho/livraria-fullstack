const helmet = require('helmet')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')

// Cabeçalhos de segurança. A Content Security Policy libera apenas as origens
// externas que o frontend realmente usa: Google Fonts e Open Library (capas).
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      // As capas da Open Library redirecionam para servidores do archive.org
      'img-src': ["'self'", 'data:', 'https://covers.openlibrary.org', 'https://*.archive.org'],
      'connect-src': ["'self'", 'https://openlibrary.org']
    }
  }
})

// A documentação do Swagger UI depende de estilos inline e imagens em data URI
const docsSecurityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:']
    }
  }
})

// Requisições da mesma origem (frontend servido pela API) não passam pelo CORS.
// CORS_ORIGIN libera origens extras, como o Live Server, separadas por vírgula.
const corsPolicy = cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : false
})

// Limita cada IP a 300 requisições a cada 15 minutos na API
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente em alguns minutos.' }
})

module.exports = { securityHeaders, docsSecurityHeaders, corsPolicy, apiRateLimit }
