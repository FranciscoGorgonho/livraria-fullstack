// Aplica o tema salvo antes da renderização para evitar o "flash" de cores.
// Fica em arquivo próprio porque a Content Security Policy bloqueia scripts inline.
try {
  const theme = localStorage.getItem('livraria:theme')
  if (theme) document.documentElement.dataset.theme = theme
} catch {}
