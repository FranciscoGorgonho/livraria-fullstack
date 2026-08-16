# Livraria FullStack

Eu desenvolvi este projeto como uma aplicação full stack para gerenciar um catálogo de livros de forma simples e prática. A ideia foi criar um sistema completo, com backend em Node.js e frontend em HTML, CSS e JavaScript, para permitir o cadastro, consulta, edição e exclusão de livros de maneira intuitiva.

Minha intenção foi manter a aplicação fácil de entender, leve de executar e útil para cenários reais de gestão de acervo bibliográfico. O projeto funciona como uma livraria digital, onde eu posso registrar títulos, associar autores e manter o controle das publicações.

## Sobre o projeto

Este sistema foi pensado para facilitar a administração de um acervo de livros. A aplicação permite registrar informações como título, autor e ano de publicação, além de gerenciar os dados de forma organizada e acessível.

A estrutura da aplicação está dividida em:

- backend em Node.js com Express para expor a API;
- banco de dados PostgreSQL para armazenar as informações;
- frontend em HTML, CSS e JavaScript para interagir com o usuário;
- validações básicas para garantir dados consistentes antes de salvar.

## Funcionalidades

Eu implementei as seguintes funcionalidades no projeto:

- cadastro de livros;
- listagem completa dos livros cadastrados;
- edição de dados já existentes;
- exclusão de livros do catálogo;
- associação automática de autores ao cadastrar ou atualizar um livro;
- validação dos campos obrigatórios;
- interface simples para uso direto no navegador.

## Tecnologias utilizadas

Eu usei as seguintes tecnologias para construir a aplicação:

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- CORS
- HTML
- CSS
- JavaScript

## Estrutura do projeto

A estrutura atual do projeto está organizada assim:

```text
livraria-fullstack/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── tests/
│   └── test-db.js
├── README.md
└── .gitignore
```

## Pré-requisitos

Antes de começar, eu preciso ter instalado no meu ambiente:

- Node.js
- npm
- PostgreSQL
- Git
- VS Code ou outro editor de código

## Instalação

Eu sigo os passos abaixo para configurar o projeto localmente:

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/livraria-fullstack.git
cd livraria-fullstack
```

2. Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE livraria;
```

3. Crie as tabelas necessárias:

```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publication_year INT NOT NULL,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
);
```

4. Acesse a pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

5. Crie um arquivo `.env` dentro da pasta `backend` com as seguintes variáveis:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=livraria
```

6. Inicie o servidor do backend:

```bash
node server.js
```

Se tudo estiver correto, o backend estará disponível em:

```text
http://localhost:3000
```

## Como usar

Eu utilizo a aplicação da seguinte forma:

1. Abro o frontend no navegador;
2. Preencho os campos de título, autor e ano de publicação;
3. Clico em salvar para cadastrar um livro;
4. Posso editar ou excluir qualquer item da lista;
5. A interface conversa com a API do backend para realizar as operações.

Para abrir o frontend, eu posso abrir o arquivo `frontend/index.html` diretamente no navegador ou servir a pasta com um servidor estático, por exemplo:

```bash
cd frontend
python -m http.server 8000
```

Depois, acesso:

```text
http://localhost:8000
```

## Exemplos de uso da API

Eu também posso consumir a API diretamente por HTTP. Abaixo estão alguns exemplos práticos.

### Listar todos os livros

```http
GET http://localhost:3000/api/books
```

### Cadastrar um livro

```http
POST http://localhost:3000/api/books
Content-Type: application/json
```

```json
{
  "title": "Dom Casmurro",
  "author_name": "Machado de Assis",
  "publication_year": 1899
}
```

### Buscar um livro por ID

```http
GET http://localhost:3000/api/books/1
```

### Atualizar um livro

```http
PUT http://localhost:3000/api/books/1
Content-Type: application/json
```

```json
{
  "title": "Memórias Póstumas de Brás Cubas",
  "author_name": "Machado de Assis",
  "publication_year": 1881
}
```

### Excluir um livro

```http
DELETE http://localhost:3000/api/books/1
```

## Contribuições

Eu aceito contribuições para melhorar o projeto, corrigir bugs, adicionar novas funcionalidades e aprimorar a documentação. Se quiser colaborar comigo, o fluxo recomendado é:

1. fazer um fork do projeto;
2. criar uma branch para a alteração;
3. implementar a melhoria ou correção;
4. abrir um pull request com uma descrição clara do que foi feito.

Eu valorizo melhorias na interface, na API, na validação de dados e na experiência geral do usuário. Contribuições bem documentadas ajudam a manter o projeto mais organizado, estável e fácil de evoluir.

## Observações finais

Eu desenvolvi esta aplicação como uma solução prática para gestão de livros, combinando frontend e backend em uma estrutura simples e funcional. O objetivo foi criar algo que pudesse ser executado localmente, entendido facilmente e ampliado conforme novas necessidades surgissem.

Se eu quiser evoluir o projeto no futuro, consigo expandir essa base para incluir busca por título, filtros por autor, paginação, autenticação, upload de imagens e muito mais.

