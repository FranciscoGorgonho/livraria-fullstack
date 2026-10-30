const API_URL = 'http://localhost:3000/api/books'

const bookList = document.getElementById('book-list')
const bookCount = document.getElementById('book-count')
const bookDialog = document.getElementById('book-dialog')
const bookForm = document.getElementById('book-form')
const dialogTitle = document.getElementById('book-dialog-title')
const formError = document.getElementById('form-error')
const saveBtn = document.getElementById('save-btn')
const confirmDialog = document.getElementById('confirm-dialog')
const confirmText = document.getElementById('confirm-text')
const confirmBtn = document.getElementById('confirm-delete')
const toasts = document.getElementById('toasts')
const searchInput = document.getElementById('search')
const sortSelect = document.getElementById('sort')

// Campos do formulário indexados pelo nome usado na API
const fields = {
  title: document.getElementById('title'),
  author_name: document.getElementById('author'),
  publication_year: document.getElementById('year')
}
fields.publication_year.max = new Date().getFullYear()

const ICONS = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
}

const SORTERS = {
  recent: (a, b) => b.id - a.id,
  title: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
  author: (a, b) => a.author.localeCompare(b.author, 'pt-BR'),
  newest: (a, b) => b.publication_year - a.publication_year,
  oldest: (a, b) => a.publication_year - b.publication_year
}

let books = []
let selectedBookId = null
let bookToDelete = null

// Cria elementos com segurança: textos sempre via textContent, nunca innerHTML
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value
    else if (key === 'text') node.textContent = value
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value)
    else node.setAttribute(key, value)
  }
  node.append(...children)
  return node
}

function icon(name) {
  const wrapper = el('span', { class: 'icon', 'aria-hidden': 'true' })
  wrapper.innerHTML = ICONS[name] // SVG estático, sem dados do usuário
  return wrapper
}

// Gera um tom de cor estável a partir do texto, usado nas capas
function hueFrom(text) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return hash
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'Erro inesperado. Tente novamente.')
    error.fields = data.errors
    throw error
  }
  return data
}

function errorMessage(error) {
  return error instanceof TypeError
    ? 'Não foi possível conectar ao servidor.'
    : error.message
}

function toast(message, type = 'success') {
  const item = el('div', { class: `toast toast--${type}` }, message)
  toasts.append(item)
  setTimeout(() => {
    item.classList.add('toast--leaving')
    item.addEventListener('animationend', () => item.remove())
  }, 3500)
}

// ---------- Renderização ----------

function renderSkeleton() {
  const placeholders = Array.from({ length: 8 }, () =>
    el('div', { class: 'book-card book-card--skeleton', 'aria-hidden': 'true' },
      el('div', { class: 'book-card__cover' }),
      el('div', { class: 'book-card__body' },
        el('span', { class: 'skeleton-line' }),
        el('span', { class: 'skeleton-line skeleton-line--short' })))
  )
  bookList.replaceChildren(...placeholders)
}

function renderMessage({ title, text, action }) {
  bookList.replaceChildren(
    el('div', { class: 'empty-state' },
      icon('book'),
      el('h3', { text: title }),
      el('p', { text }),
      action || '')
  )
}

function createCard(book) {
  const cover = el('div', { class: 'book-card__cover', style: `--hue: ${hueFrom(book.title + book.author)}` },
    el('span', { class: 'book-card__cover-title', text: book.title }),
    el('span', { class: 'book-card__cover-author', text: book.author }))

  return el('article', { class: 'book-card' },
    cover,
    el('div', { class: 'book-card__body' },
      el('h3', { class: 'book-card__title', text: book.title, title: book.title }),
      el('p', { class: 'book-card__author', text: book.author }),
      el('div', { class: 'book-card__footer' },
        el('span', { class: 'chip', text: book.publication_year }),
        el('div', { class: 'book-card__actions' },
          el('button', { class: 'icon-btn', type: 'button', title: 'Editar', 'aria-label': `Editar ${book.title}`, onclick: () => openForm(book) }, icon('edit')),
          el('button', { class: 'icon-btn icon-btn--danger', type: 'button', title: 'Excluir', 'aria-label': `Excluir ${book.title}`, onclick: () => askDelete(book) }, icon('trash'))))))
}

// Remove acentos e caixa para que "joao" encontre "João"
function normalize(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function visibleBooks() {
  const term = normalize(searchInput.value.trim())
  return books
    .filter(book => !term || normalize(`${book.title} ${book.author}`).includes(term))
    .sort(SORTERS[sortSelect.value])
}

function renderBooks() {
  const visible = visibleBooks()
  const label = books.length === 1 ? 'livro' : 'livros'
  bookCount.textContent = visible.length === books.length
    ? `${books.length} ${label}`
    : `${visible.length} de ${books.length} ${label}`

  if (!books.length) {
    return renderMessage({
      title: 'Seu acervo está vazio',
      text: 'Cadastre o primeiro livro para começar.',
      action: el('button', { class: 'btn btn--primary', type: 'button', text: 'Adicionar livro', onclick: () => openForm() })
    })
  }
  if (!visible.length) {
    return renderMessage({
      title: 'Nenhum livro encontrado',
      text: `Nada corresponde a "${searchInput.value.trim()}".`,
      action: el('button', { class: 'btn btn--ghost', type: 'button', text: 'Limpar busca', onclick: clearSearch })
    })
  }
  bookList.replaceChildren(...visible.map(createCard))
}

function clearSearch() {
  searchInput.value = ''
  renderBooks()
  searchInput.focus()
}

async function loadBooks({ skeleton = true } = {}) {
  if (skeleton) renderSkeleton()
  try {
    books = await request(API_URL)
    renderBooks()
  } catch (error) {
    console.error(error)
    bookCount.textContent = ''
    renderMessage({
      title: 'Não foi possível carregar o catálogo',
      text: `Verifique se a API está rodando em ${API_URL}.`,
      action: el('button', { class: 'btn btn--ghost', type: 'button', text: 'Tentar novamente', onclick: () => loadBooks() })
    })
  }
}

// ---------- Formulário ----------

function showErrors(errors = {}) {
  for (const [name, input] of Object.entries(fields)) {
    const message = errors[name] || ''
    input.closest('.field').querySelector('.field__error').textContent = message
    input.setAttribute('aria-invalid', Boolean(message))
  }
}

function openForm(book = null) {
  bookForm.reset()
  showErrors()
  formError.textContent = ''
  selectedBookId = book ? book.id : null
  dialogTitle.textContent = book ? 'Editar livro' : 'Novo livro'

  if (book) {
    fields.title.value = book.title
    fields.author_name.value = book.author
    fields.publication_year.value = book.publication_year
  }
  bookDialog.showModal()
  fields.title.focus()
}

bookForm.addEventListener('submit', async e => {
  e.preventDefault()

  const payload = {
    title: fields.title.value.trim(),
    author_name: fields.author_name.value.trim(),
    publication_year: Number(fields.publication_year.value)
  }
  const editing = Boolean(selectedBookId)

  saveBtn.disabled = true
  formError.textContent = ''
  try {
    await request(editing ? `${API_URL}/${selectedBookId}` : API_URL, {
      method: editing ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    })
    bookDialog.close()
    toast(editing ? 'Livro atualizado com sucesso' : 'Livro cadastrado com sucesso')
    loadBooks({ skeleton: false })
  } catch (error) {
    // Erros de validação aparecem em cada campo; os demais, no rodapé do modal
    if (error.fields) showErrors(error.fields)
    else formError.textContent = errorMessage(error)
  } finally {
    saveBtn.disabled = false
  }
})

// ---------- Exclusão ----------

function askDelete(book) {
  bookToDelete = book
  confirmText.textContent = `"${book.title}" será removido do catálogo. Essa ação não pode ser desfeita.`
  confirmDialog.showModal()
}

confirmBtn.addEventListener('click', async () => {
  confirmBtn.disabled = true
  try {
    await request(`${API_URL}/${bookToDelete.id}`, { method: 'DELETE' })
    toast('Livro excluído')
    loadBooks({ skeleton: false })
  } catch (error) {
    toast(errorMessage(error), 'error')
  } finally {
    confirmDialog.close()
    confirmBtn.disabled = false
  }
})

// ---------- Eventos gerais ----------

document.getElementById('new-book-btn').addEventListener('click', () => openForm())

searchInput.addEventListener('input', renderBooks)
sortSelect.addEventListener('change', renderBooks)

// Atalho "/" foca a busca, como em GitHub e YouTube
document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.target.closest('input, textarea, select, dialog')) {
    e.preventDefault()
    searchInput.focus()
  }
})

document.querySelectorAll('[data-close]').forEach(button =>
  button.addEventListener('click', () => button.closest('dialog').close())
)

// Fecha o modal ao clicar fora dele
document.querySelectorAll('dialog').forEach(dialog =>
  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close()
  })
)

loadBooks()
