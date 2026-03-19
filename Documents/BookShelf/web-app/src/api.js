// API simulée avec localStorage

const STORAGE_KEY = 'bookshelf_data'

function getData() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : { books: [], sessions: [] }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

// Books API
export const books = {
  getAll: async (category) => {
    const data = getData()
    let bookList = data.books
    if (category) {
      bookList = bookList.filter(b => b.shelf_category === category)
    }
    // Calculer le progress
    bookList = bookList.map(b => ({
      ...b,
      progress_percent: b.total_pages > 0 ? Math.round((b.current_page / b.total_pages) * 100 * 10) / 10 : 0
    }))
    return { data: bookList }
  },

  get: async (id) => {
    const data = getData()
    const book = data.books.find(b => b.id === id || b.id === parseInt(id))
    if (!book) throw new Error('Livre non trouvé')
    book.progress_percent = book.total_pages > 0 ? Math.round((book.current_page / book.total_pages) * 100 * 10) / 10 : 0
    return { data: book }
  },

  create: async (bookData) => {
    const data = getData()
    const newBook = {
      id: generateId(),
      ...bookData,
      current_page: 0,
      cover_url: null,
      rating: null,
      shelf_position: data.books.length,
      started_at: null,
      finished_at: null,
      created_at: new Date().toISOString(),
      progress_percent: 0
    }
    data.books.unshift(newBook)
    saveData(data)
    return { data: newBook }
  },

  update: async (id, updates) => {
    const data = getData()
    const index = data.books.findIndex(b => b.id === id || b.id === parseInt(id))
    if (index === -1) throw new Error('Livre non trouvé')

    const book = data.books[index]

    // Gérer les changements de statut
    if (updates.shelf_category && updates.shelf_category !== book.shelf_category) {
      if (updates.shelf_category === 'En cours' && !book.started_at) {
        updates.started_at = new Date().toISOString()
      }
      if (updates.shelf_category === 'Terminé') {
        updates.finished_at = new Date().toISOString()
        updates.current_page = book.total_pages
      }
    }

    Object.assign(book, updates)
    book.progress_percent = book.total_pages > 0 ? Math.round((book.current_page / book.total_pages) * 100 * 10) / 10 : 0
    saveData(data)
    return { data: book }
  },

  delete: async (id) => {
    const data = getData()
    data.books = data.books.filter(b => b.id !== id && b.id !== parseInt(id))
    data.sessions = data.sessions.filter(s => s.book_id !== id && s.book_id !== parseInt(id))
    saveData(data)
    return { data: { message: 'Supprimé' } }
  },

  uploadCover: async (id, file) => {
    const data = getData()
    const book = data.books.find(b => b.id === id || b.id === parseInt(id))
    if (!book) throw new Error('Livre non trouvé')

    // Convertir en base64
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        book.cover_url = reader.result
        book.progress_percent = book.total_pages > 0 ? Math.round((book.current_page / book.total_pages) * 100 * 10) / 10 : 0
        saveData(data)
        resolve({ data: book })
      }
      reader.readAsDataURL(file)
    })
  }
}

// Reading sessions API
export const reading = {
  getSessions: async (bookId) => {
    const data = getData()
    const sessions = data.sessions
      .filter(s => s.book_id === bookId || s.book_id === parseInt(bookId))
      .sort((a, b) => new Date(b.session_date) - new Date(a.session_date))
    return { data: sessions }
  },

  createSession: async (sessionData) => {
    const data = getData()
    const newSession = {
      id: generateId(),
      ...sessionData,
      created_at: new Date().toISOString()
    }
    data.sessions.unshift(newSession)

    // Mettre à jour le livre
    const book = data.books.find(b => b.id === sessionData.book_id || b.id === parseInt(sessionData.book_id))
    if (book) {
      book.current_page = sessionData.end_page
      if (book.shelf_category === 'A Lire') {
        book.shelf_category = 'En cours'
        book.started_at = new Date().toISOString()
      }
      if (book.current_page >= book.total_pages) {
        book.shelf_category = 'Terminé'
        book.finished_at = new Date().toISOString()
      }
    }

    saveData(data)
    return { data: newSession }
  },

  getStats: async () => {
    const data = getData()

    const books_read = data.books.filter(b => b.shelf_category === 'Terminé').length
    const books_reading = data.books.filter(b => b.shelf_category === 'En cours').length
    const books_to_read = data.books.filter(b => b.shelf_category === 'A Lire').length

    const total_pages_read = data.sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)

    // Stats des 30 derniers jours
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyMap = {}
    data.sessions
      .filter(s => new Date(s.session_date) >= thirtyDaysAgo)
      .forEach(s => {
        const date = s.session_date.split('T')[0]
        if (!dailyMap[date]) {
          dailyMap[date] = { date, pages_read: 0, sessions_count: 0 }
        }
        dailyMap[date].pages_read += s.pages_read || 0
        dailyMap[date].sessions_count += 1
      })

    const daily_stats = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date))

    // Calculer le streak
    let current_streak = 0
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (dailyMap[today]) {
      current_streak = 1
      let checkDate = new Date()
      checkDate.setDate(checkDate.getDate() - 1)
      while (dailyMap[checkDate.toISOString().split('T')[0]]) {
        current_streak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    } else if (dailyMap[yesterday]) {
      current_streak = 1
      let checkDate = new Date()
      checkDate.setDate(checkDate.getDate() - 2)
      while (dailyMap[checkDate.toISOString().split('T')[0]]) {
        current_streak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }

    return {
      data: {
        total_books: data.books.length,
        books_read,
        books_reading,
        books_to_read,
        total_pages_read,
        current_streak,
        daily_stats,
        monthly_stats: []
      }
    }
  }
}

// Auth factice (pas besoin avec localStorage)
export const auth = {
  login: async () => ({ data: { user: { username: 'Utilisateur' } } }),
  register: async () => ({ data: { user: { username: 'Utilisateur' } } }),
  me: async () => ({ data: { username: 'Utilisateur' } })
}

export default { books, reading, auth }
