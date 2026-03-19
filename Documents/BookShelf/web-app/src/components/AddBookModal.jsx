import { useState } from 'react'
import Modal from './Modal'
import { books } from '../api'

const categories = ['A Lire', 'En cours', 'Terminé', 'Abandonné', 'Wishlist']

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    author: '',
    total_pages: '',
    isbn: '',
    genre: '',
    shelf_category: 'A Lire'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        ...form,
        total_pages: parseInt(form.total_pages) || 0
      }
      const res = await books.create(data)
      onBookAdded(res.data)
      onClose()
      setForm({
        title: '',
        author: '',
        total_pages: '',
        isbn: '',
        genre: '',
        shelf_category: 'A Lire'
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un livre">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auteur
          </label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de pages
            </label>
            <input
              type="number"
              name="total_pages"
              value={form.total_pages}
              onChange={handleChange}
              className="input"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Étagère
          </label>
          <select
            name="shelf_category"
            value={form.shelf_category}
            onChange={handleChange}
            className="input"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
