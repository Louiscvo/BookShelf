import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs d'auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, username, password) => api.post('/auth/register', { email, username, password }),
  me: () => api.get('/auth/me')
}

// Books
export const books = {
  getAll: (category) => api.get('/books/', { params: { category } }),
  getShelves: () => api.get('/books/shelves'),
  get: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books/', data),
  update: (id, data) => api.patch(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  uploadCover: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/books/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// Reading sessions
export const reading = {
  getSessions: (bookId) => api.get('/reading/sessions', { params: { book_id: bookId } }),
  getStats: () => api.get('/reading/stats'),
  createSession: (data) => api.post('/reading/sessions', data)
}

export default api
