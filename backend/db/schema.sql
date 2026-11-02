-- Estrutura do banco da Livraria FullStack.
-- Pode ser executado mais de uma vez sem erro (idempotente).

CREATE TABLE IF NOT EXISTS authors (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  CONSTRAINT authors_name_unique UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS books (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  publication_year INT NOT NULL,
  author_id        INT NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
  -- O limite superior (ano atual) é validado na API: CHECK deve ser imutável
  CONSTRAINT books_publication_year_check CHECK (publication_year > 0)
);

-- Acelera o JOIN com autores e a listagem ordenada por título
CREATE INDEX IF NOT EXISTS books_author_id_idx ON books (author_id);
CREATE INDEX IF NOT EXISTS books_title_idx ON books (title);
