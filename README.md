📚 Livraria FullStack

Bem-vindo ao projeto Livraria FullStack, uma aplicação web para gerenciar um catálogo de livros. Este projeto permite adicionar, editar, excluir e visualizar livros, além de gerenciar autores e categorias.

📖 Descrição do Projeto
Este projeto foi desenvolvido para facilitar o gerenciamento de um acervo de livros, permitindo que usuários adicionem novos livros, editem informações existentes, e mantenham os dados organizados por categorias e autores.

🚀 Funcionalidades
Adicionar, editar e excluir livros;
Gerenciar informações de autores;
Categorizar livros.
Interface amigável para listagem e pesquisa de livros;

🛠️ Tecnologias Utilizadas<br>
Frontend: HTML, CSS, JavaScript;<br>
Backend: Node.js, Express.js;<br>
Banco de Dados: PostgreSQL.<br>

🎯 Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

Node.js<br>
PostgreSQL<br>
Além disso, é bom ter um editor para trabalhar com o código como VSCode.

⚙️ Configuração do Ambiente
Clone o repositório:

   git clone https://github.com/FranciscoGorgonho/livraria-fullstack.git<br>
Acesse o diretório do projeto:
   cd livraria-fullstack<br>

Configurar o Banco de Dados:
Crie o banco de dados no PostgreSQL:
sql

     CREATE DATABASE livraria;
Configure as tabelas:
sql

     CREATE TABLE authors (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       bio TEXT
     );

     CREATE TABLE books (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       publication_year INT NOT NULL,
       author_id INT,
       FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
     );

Configurar o Backend:

Acesse o diretório backend e instale as dependências:

     cd backend
     npm install
Crie um arquivo .env no diretório backend com as seguintes informações:
env

     PORT=3000
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=minhasenha
     DB_DATABASE=livraria

Executar o Backend:
Inicie o servidor:

node server.js
Executar o Frontend:
Abra o arquivo index.html no seu navegador ou use um servidor de desenvolvimento como http-server.
📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.


