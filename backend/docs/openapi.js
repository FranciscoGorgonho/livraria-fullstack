// Especificação OpenAPI da API, exibida pelo Swagger UI em /api/docs
const bookExample = {
  id: 1,
  title: 'Dom Casmurro',
  publication_year: 1899,
  author: 'Machado de Assis'
}

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'ID do livro (inteiro positivo)',
  schema: { type: 'integer', minimum: 1 },
  example: 1
}

const message = text => ({
  type: 'object',
  properties: { message: { type: 'string', example: text } }
})

const responses = {
  InvalidId: {
    description: 'ID inválido',
    content: { 'application/json': { schema: message('ID inválido') } }
  },
  NotFound: {
    description: 'Livro não encontrado',
    content: { 'application/json': { schema: message('Livro não encontrado') } }
  },
  ValidationError: {
    description: 'Dados inválidos ou JSON malformado',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } }
  },
  TooManyRequests: {
    description: 'Limite de requisições excedido (300 a cada 15 minutos por IP)',
    content: { 'application/json': { schema: message('Muitas requisições. Tente novamente em alguns minutos.') } }
  },
  ServerError: {
    description: 'Erro interno (detalhes registrados apenas no log do servidor)',
    content: { 'application/json': { schema: message('Erro interno no servidor') } }
  }
}

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Livraria FullStack API',
    version: '1.0.0',
    description: 'API REST para gerenciar o catálogo de livros da Livraria FullStack.\n\n' +
      'Ao cadastrar ou atualizar um livro, o autor é criado automaticamente caso ainda não exista.',
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' }
  },
  servers: [{ url: '/api', description: 'Servidor atual' }],
  tags: [{ name: 'Livros', description: 'Cadastro, consulta, edição e exclusão de livros' }],
  paths: {
    '/books': {
      get: {
        tags: ['Livros'],
        summary: 'Lista todos os livros',
        description: 'Retorna os livros do mais recente para o mais antigo.',
        responses: {
          200: {
            description: 'Lista de livros',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } }
              }
            }
          },
          429: responses.TooManyRequests,
          500: responses.ServerError
        }
      },
      post: {
        tags: ['Livros'],
        summary: 'Cadastra um livro',
        requestBody: { $ref: '#/components/requestBodies/BookInput' },
        responses: {
          201: {
            description: 'Livro cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookRecord' }
              }
            }
          },
          400: responses.ValidationError,
          413: {
            description: 'Corpo da requisição maior que 10 kb',
            content: { 'application/json': { schema: message('Corpo da requisição muito grande') } }
          },
          429: responses.TooManyRequests,
          500: responses.ServerError
        }
      }
    },
    '/books/{id}': {
      parameters: [idParameter],
      get: {
        tags: ['Livros'],
        summary: 'Busca um livro pelo ID',
        responses: {
          200: {
            description: 'Livro encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } }
          },
          400: responses.InvalidId,
          404: responses.NotFound,
          429: responses.TooManyRequests,
          500: responses.ServerError
        }
      },
      put: {
        tags: ['Livros'],
        summary: 'Atualiza um livro',
        requestBody: { $ref: '#/components/requestBodies/BookInput' },
        responses: {
          200: {
            description: 'Livro atualizado',
            content: { 'application/json': { schema: message('Livro atualizado com sucesso') } }
          },
          400: responses.ValidationError,
          404: responses.NotFound,
          429: responses.TooManyRequests,
          500: responses.ServerError
        }
      },
      delete: {
        tags: ['Livros'],
        summary: 'Exclui um livro',
        responses: {
          200: {
            description: 'Livro excluído',
            content: { 'application/json': { schema: message('Livro excluído com sucesso') } }
          },
          400: responses.InvalidId,
          404: responses.NotFound,
          429: responses.TooManyRequests,
          500: responses.ServerError
        }
      }
    }
  },
  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          publication_year: { type: 'integer' },
          author: { type: 'string', description: 'Nome do autor' }
        },
        example: bookExample
      },
      BookRecord: {
        type: 'object',
        description: 'Registro gravado na tabela books',
        properties: {
          id: { type: 'integer', example: 23 },
          title: { type: 'string', example: 'Helena' },
          publication_year: { type: 'integer', example: 1876 },
          author_id: { type: 'integer', example: 1 }
        }
      },
      BookInput: {
        type: 'object',
        required: ['title', 'author_name', 'publication_year'],
        properties: {
          title: { type: 'string', maxLength: 255, example: 'Helena' },
          author_name: { type: 'string', maxLength: 255, example: 'Machado de Assis' },
          publication_year: {
            type: 'integer',
            minimum: 1,
            description: 'Entre 1 e o ano atual',
            example: 1876
          }
        }
      },
      ValidationError: {
        type: 'object',
        description: 'Erros por campo, ou uma mensagem geral para JSON malformado',
        properties: {
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' },
            example: { title: 'Título é obrigatório', publication_year: 'Ano deve ser um número inteiro entre 1 e 2026' }
          },
          message: { type: 'string', example: 'JSON inválido no corpo da requisição' }
        }
      }
    },
    requestBodies: {
      BookInput: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/BookInput' } }
        }
      }
    }
  }
}
