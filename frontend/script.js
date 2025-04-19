const API_URL = 'http://localhost:3000/api/books'

const bookForm = document.getElementById('book-form')
const cancelBtn = document.getElementById('cancel-edit')
const bookList = document.getElementById('book-list')

let selectedBookId = null

window.onload = fetchBooks

cancelBtn.addEventListener('click', () => {
  selectedBookId = null
  bookForm.reset()
  cancelBtn.style.display = 'none'
})

bookForm.addEventListener('submit', async e => {
  e.preventDefault()

  const title = document.getElementById('title').value.trim()
  const author_name = document.getElementById('author').value.trim()
  const publication_year = parseInt(document.getElementById('year').value)

  const payload = { title, author_name, publication_year }
  const method = selectedBookId ? 'PUT' : 'POST'
  const endpoint = selectedBookId ? `${API_URL}/${selectedBookId}` : API_URL

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      let msg = ''
      if (data.errors) {
        msg = Object.values(data.errors).join('\n')
      } else if (data.message) {
        msg = data.message
      }
      return alert(`Erro ao salvar: ${msg}`)
    }

    bookForm.reset()
    selectedBookId = null
    cancelBtn.style.display = 'none'
    fetchBooks()
  } catch (err) {
    alert('Erro na conexão com o servidor.')
    console.error(err)
  }
})

async function fetchBooks() {
  try {
    const res = await fetch(API_URL)
    const books = await res.json()
    bookList.innerHTML = ''
    books.forEach((book, index) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.publication_year}</td>
        <td class="actions">
          <button class="edit" onclick="editBook(${book.id}, '${escape(book.title)}', '${escape(book.author)}', ${book.publication_year})">Editar</button>
          <button class="delete" onclick="deleteBook(${book.id})">Excluir</button>
        </td>
      `
      bookList.appendChild(row)
    })
  } catch (error) {
    console.error(error)
    bookList.innerHTML = '<tr><td colspan="5">Erro ao carregar livros.</td></tr>'
  }
}

function editBook(id, title, author, publication_year) {
  document.getElementById('title').value = unescape(title)
  document.getElementById('author').value = unescape(author)
  document.getElementById('year').value = publication_year
  selectedBookId = id
  cancelBtn.style.display = 'inline'
}

async function deleteBook(id) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    fetchBooks()
  } catch (err) {
    alert('Erro ao deletar livro.')
    console.error(err)
  }
}
