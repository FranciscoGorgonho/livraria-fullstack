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

      // textContent evita que dados do usuário sejam interpretados como HTML (XSS)
      for (const value of [index + 1, book.title, book.author, book.publication_year]) {
        const cell = document.createElement('td')
        cell.textContent = value
        row.appendChild(cell)
      }

      const actions = document.createElement('td')
      actions.className = 'actions'

      const editBtn = document.createElement('button')
      editBtn.className = 'edit'
      editBtn.textContent = 'Editar'
      editBtn.addEventListener('click', () => editBook(book))

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete'
      deleteBtn.textContent = 'Excluir'
      deleteBtn.addEventListener('click', () => deleteBook(book.id))

      actions.append(editBtn, deleteBtn)
      row.appendChild(actions)
      bookList.appendChild(row)
    })
  } catch (error) {
    console.error(error)
    bookList.innerHTML = '<tr><td colspan="5">Erro ao carregar livros.</td></tr>'
  }
}

function editBook(book) {
  document.getElementById('title').value = book.title
  document.getElementById('author').value = book.author
  document.getElementById('year').value = book.publication_year
  selectedBookId = book.id
  cancelBtn.style.display = 'inline'
}

async function deleteBook(id) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const data = await response.json()
      return alert(`Erro ao excluir: ${data.message}`)
    }
    fetchBooks()
  } catch (err) {
    alert('Erro ao deletar livro.')
    console.error(err)
  }
}
