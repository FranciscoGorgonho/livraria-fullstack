-- Dados de exemplo para o catálogo.
-- Pode ser executado mais de uma vez: autores e livros existentes não são duplicados.

BEGIN;

CREATE TEMP TABLE seed (title TEXT, author TEXT, publication_year INT) ON COMMIT DROP;

INSERT INTO seed (title, author, publication_year)
VALUES
  ('Dom Casmurro',                     'Machado de Assis',          1899),
  ('Memórias Póstumas de Brás Cubas',  'Machado de Assis',          1881),
  ('Quincas Borba',                    'Machado de Assis',          1891),
  ('Vidas Secas',                      'Graciliano Ramos',          1938),
  ('São Bernardo',                     'Graciliano Ramos',          1934),
  ('Grande Sertão: Veredas',           'João Guimarães Rosa',       1956),
  ('A Hora da Estrela',                'Clarice Lispector',         1977),
  ('A Paixão Segundo G.H.',            'Clarice Lispector',         1964),
  ('Capitães da Areia',                'Jorge Amado',               1937),
  ('Gabriela, Cravo e Canela',         'Jorge Amado',               1958),
  ('O Cortiço',                        'Aluísio Azevedo',           1890),
  ('Macunaíma',                        'Mário de Andrade',          1928),
  ('O Quinze',                         'Rachel de Queiroz',         1930),
  ('Iracema',                          'José de Alencar',           1865),
  ('Triste Fim de Policarpo Quaresma', 'Lima Barreto',              1915),
  ('O Tempo e o Vento',                'Erico Verissimo',           1949),
  ('O Alquimista',                     'Paulo Coelho',              1988),
  ('Cem Anos de Solidão',              'Gabriel García Márquez',    1967),
  ('1984',                             'George Orwell',             1949),
  ('O Pequeno Príncipe',               'Antoine de Saint-Exupéry',  1943),
  ('Orgulho e Preconceito',            'Jane Austen',               1813),
  ('O Senhor dos Anéis',               'J.R.R. Tolkien',            1954);

-- Comandos separados: linhas inseridas em uma CTE não ficam visíveis
-- para o restante do mesmo comando
INSERT INTO authors (name)
SELECT DISTINCT author FROM seed
ON CONFLICT (name) DO NOTHING;

INSERT INTO books (title, publication_year, author_id)
SELECT seed.title, seed.publication_year, authors.id
FROM seed
JOIN authors ON authors.name = seed.author
WHERE NOT EXISTS (
  SELECT 1 FROM books
  WHERE books.title = seed.title AND books.author_id = authors.id
);

COMMIT;
