<div align="center">

# 📚 Livraria FullStack

**Catálogo de livros full stack com API REST em Node.js, PostgreSQL e uma interface moderna em JavaScript puro.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

[Funcionalidades](#-funcionalidades) •
[Tecnologias](#%EF%B8%8F-tecnologias) •
[Como executar](#-como-executar) •
[API](#-api) •
[Roadmap](#%EF%B8%8F-roadmap)

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/catalogo-escuro.jpg" />
  <img alt="Tela do catálogo com capas de livros, busca e estatísticas do acervo" src="docs/screenshots/catalogo-claro.jpg" width="900" />
</picture>

<sub>A imagem acima acompanha o tema do seu GitHub: troque para o modo escuro e veja a outra versão.</sub>

</div>

---

## ✨ Funcionalidades

| | |
|---|---|
| 📖 **Catálogo visual** | Livros exibidos como capas em um grid responsivo |
| 🖼️ **Capas automáticas** | Buscadas na [Open Library](https://openlibrary.org/developers/api) a partir do título e autor. Sem resultado, uma capa colorida é gerada |
| 🔍 **Busca instantânea** | Por título ou autor, ignorando acentos. Atalho: <kbd>/</kbd> |
| ↕️ **Ordenação** | Por cadastro, título, autor ou ano de publicação |
| 🌗 **Tema claro e escuro** | Segue o sistema e lembra a escolha do usuário |
| 📊 **Números do acervo** | Total de livros, autores e período coberto |
| ✍️ **CRUD completo** | Cadastro e edição em modal, com erros de validação exibidos em cada campo |
| 📱 **Responsivo e acessível** | Funciona no celular, navegável por teclado e compatível com leitores de tela |

## 🛠️ Tecnologias

**Backend**
- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/): API REST
- [PostgreSQL](https://www.postgresql.org/) + [node-postgres](https://node-postgres.com/): persistência, com queries parametrizadas e transações
- [dotenv](https://github.com/motdotla/dotenv) e [CORS](https://github.com/expressjs/cors)

**Frontend**
- HTML, CSS e JavaScript puros, sem frameworks
- Design tokens em CSS custom properties, `<dialog>` nativo e Fetch API
- Fontes [Fraunces](https://fonts.google.com/specimen/Fraunces) e [Inter](https://fonts.google.com/specimen/Inter)

## 🏛️ Arquitetura

```text
┌──────────────┐   HTTP/JSON   ┌───────────────────────────────────────┐   SQL   ┌────────────┐
│   Frontend   │ ────────────▶ │ routes → controllers → models  (API)  │ ──────▶ │ PostgreSQL │
│  HTML/CSS/JS │ ◀──────────── │       middleware de erros             │ ◀────── │            │
└──────────────┘               └───────────────────────────────────────┘         └────────────┘
       │
       └──▶ Open Library (capas)
```

```text
livraria-fullstack/
├── backend/
│   ├── config/db.js            # Pool de conexões com o PostgreSQL
│   ├── controllers/            # Validação e regras das requisições
│   ├── middleware/             # Tratamento centralizado de erros
│   ├── models/                 # Queries SQL e transações
│   ├── routes/                 # Definição dos endpoints
│   ├── server.js               # Ponto de entrada da API
│   └── .env.example            # Modelo das variáveis de ambiente
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── docs/screenshots/           # Imagens deste README
└── tests/test-db.js            # Teste de conexão com o banco
```

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [PostgreSQL](https://www.postgresql.org/download/) 14 ou superior

### 1. Clone o repositório

```bash
git clone https://github.com/FranciscoGorgonho/livraria-fullstack.git
cd livraria-fullstack
```

### 2. Crie o banco de dados

```sql
CREATE DATABASE livraria;

\c livraria

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publication_year INT NOT NULL,
  author_id INT REFERENCES authors (id) ON DELETE CASCADE
);
```

### 3. Configure e inicie a API

```bash
cd backend
cp .env.example .env   # depois, preencha DB_PASSWORD com a sua senha
npm install
node server.js
```

A API sobe em `http://localhost:3000`. Para confirmar a conexão com o banco, rode `node tests/test-db.js` a partir da raiz do projeto.

### 4. Abra o frontend

Em outro terminal:

```bash
cd frontend
python -m http.server 8000
```

Acesse **http://localhost:8000** 🎉

> Também funciona com a extensão **Live Server** do VS Code ou com `npx serve`.

## 📡 API

URL base: `http://localhost:3000/api/books`

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/` | Lista todos os livros | `200` |
| `GET` | `/:id` | Busca um livro pelo ID | `200` |
| `POST` | `/` | Cadastra um livro | `201` |
| `PUT` | `/:id` | Atualiza um livro | `200` |
| `DELETE` | `/:id` | Exclui um livro | `200` |

**Corpo para `POST` e `PUT`:**

```json
{
  "title": "Dom Casmurro",
  "author_name": "Machado de Assis",
  "publication_year": 1899
}
```

Se o autor ainda não existir, ele é criado automaticamente, na mesma transação do livro.

**Respostas de erro:**

| Status | Quando | Exemplo |
|---|---|---|
| `400` | Dados inválidos | `{ "errors": { "title": "Título é obrigatório" } }` |
| `400` | ID não numérico ou JSON malformado | `{ "message": "ID inválido" }` |
| `404` | Livro inexistente | `{ "message": "Livro não encontrado" }` |
| `500` | Erro inesperado (detalhes apenas no log do servidor) | `{ "message": "Erro interno no servidor" }` |

## 🔒 Boas práticas aplicadas

- Queries parametrizadas contra **SQL injection**
- Renderização com `textContent` contra **XSS**
- Erros internos registrados só no servidor, nunca expostos ao cliente
- Validação de tipo e de intervalo no backend
- Credenciais fora do repositório (`.env` no `.gitignore`)

## 🗺️ Roadmap

- [x] CRUD de livros com autores
- [x] Interface com capas, busca, ordenação e tema escuro
- [x] Correções de segurança (XSS, vazamento de erros, validação)
- [ ] Script de criação do banco e seed com livros de exemplo
- [ ] Scripts `npm run dev` e `npm start`
- [ ] Documentação interativa da API com Swagger
- [ ] Paginação e busca no backend
- [ ] Testes automatizados com Jest e Supertest
- [ ] Docker Compose (API + PostgreSQL)
- [ ] CI com GitHub Actions
- [ ] Deploy público

## 🤝 Contribuindo

Contribuições são bem-vindas:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Faça commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
4. Abra um Pull Request descrevendo a mudança

---

<div align="center">

Feito por **[Francisco Gorgonho](https://github.com/FranciscoGorgonho)**

⭐ Se este projeto foi útil, deixe uma estrela!

</div>
