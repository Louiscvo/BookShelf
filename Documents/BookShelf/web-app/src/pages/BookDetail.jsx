import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Edit2, Trash2, Upload, BookOpen, Calendar, Hash } from 'lucide-react'
import { books, reading } from '../api'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const API_URL = import.meta.env.VITE_API_URL || ''

const categories = ['A Lire', 'En cours', 'Terminé', 'Abandonné', 'Wishlist']

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)

  useEffect(() => {
    loadBook()
  }, [id])

  const loadBook = async () => {
    try {
      const [bookRes, sessionsRes] = await Promise.all([
        books.get(id),
        reading.getSessions(id)
      ])
      setBook(bookRes.data)
      setSessions(sessionsRes.data)
    } catch (err) {
      console.error(err)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await books.delete(id)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const res = await books.uploadCover(id, file)
      setBook(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!book) return null

  const coverUrl = book.cover_url ? `${API_URL}${book.cover_url}` : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Cover */}
            <div className="md:w-64 bg-gray-100 p-6 flex flex-col items-center">
              <div className="w-40 h-56 bg-gray-200 rounded-lg overflow-hidden mb-4 relative group">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen size={48} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Upload size={24} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={async () => {
                      const res = await books.update(id, { rating: star })
                      setBook(res.data)
                    }}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={star <= (book.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                      }
                    />
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Edit2 size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h1>
              <p className="text-gray-500 text-lg mb-4">{book.author || 'Auteur inconnu'}</p>

              {/* Category select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étagère
                </label>
                <select
                  value={book.shelf_category}
                  onChange={async (e) => {
                    const res = await books.update(id, { shelf_category: e.target.value })
                    setBook(res.data)
                  }}
                  className="input max-w-xs"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Progress */}
              {book.total_pages > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progression</span>
                    <span>{book.current_page} / {book.total_pages} pages ({book.progress_percent}%)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${book.progress_percent}%` }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      placeholder="Page actuelle"
                      className="input w-32"
                      min="0"
                      max={book.total_pages}
                      value={book.current_page}
                      onChange={async (e) => {
                        const page = parseInt(e.target.value) || 0
                        const res = await books.update(id, { current_page: page })
                        setBook(res.data)
                      }}
                    />
                    <button
                      onClick={() => setShowSessionModal(true)}
                      className="btn-primary"
                    >
                      + Session de lecture
                    </button>
                  </div>
                </div>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {book.genre && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Genre:</span>
                    <span>{book.genre}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash size={16} />
                    <span>{book.isbn}</span>
                  </div>
                )}
                {book.started_at && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Commencé le {format(new Date(book.started_at), 'd MMM yyyy', { locale: fr })}</span>
                  </div>
                )}
                {book.finished_at && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Terminé le {format(new Date(book.finished_at), 'd MMM yyyy', { locale: fr })}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{book.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reading sessions */}
          {sessions.length > 0 && (
            <div className="border-t p-6">
              <h3 className="font-medium text-gray-900 mb-4">Sessions de lecture</h3>
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{session.pages_read} pages lues</p>
                      <p className="text-sm text-gray-500">
                        Pages {session.start_page} à {session.end_page}
                        {session.duration_minutes && ` • ${session.duration_minutes} min`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(session.session_date), 'd MMM', { locale: fr })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      <EditBookModal
        book={book}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updated) => {
          setBook(updated)
          setShowEditModal(false)
        }}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer ce livre ?"
      >
        <p className="text-gray-600 mb-6">
          Cette action est irréversible. Le livre et toutes ses sessions de lecture seront supprimés.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="btn-secondary flex-1"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex-1"
          >
            Supprimer
          </button>
        </div>
      </Modal>

      {/* Session Modal */}
      <AddSessionModal
        book={book}
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSave={(session) => {
          setSessions([session, ...sessions])
          loadBook() // Refresh to update current page
          setShowSessionModal(false)
        }}
      />
    </div>
  )
}

function EditBookModal({ book, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    total_pages: 0,
    description: '',
    genre: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author || '',
        total_pages: book.total_pages,
        description: book.description || '',
        genre: book.genre || ''
      })
    }
  }, [book])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await books.update(book.id, form)
      onSave(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le livre">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="input"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
            <input
              type="number"
              value={form.total_pages}
              onChange={(e) => setForm({ ...form, total_pages: parseInt(e.target.value) || 0 })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input h-24 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AddSessionModal({ book, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    pages_read: 0,
    start_page: 0,
    end_page: 0,
    duration_minutes: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setForm(f => ({
        ...f,
        start_page: book.current_page,
        end_page: book.current_page
      }))
    }
  }, [book, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        book_id: book.id,
        pages_read: form.end_page - form.start_page,
        start_page: form.start_page,
        end_page: form.end_page,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        session_date: new Date().toISOString().split('T')[0],
        notes: form.notes || null
      }
      const res = await reading.createSession(data)
      onSave(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle session de lecture">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page début</label>
            <input
              type="number"
              value={form.start_page}
              onChange={(e) => setForm({ ...form, start_page: parseInt(e.target.value) || 0 })}
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page fin</label>
            <input
              type="number"
              value={form.end_page}
              onChange={(e) => setForm({ ...form, end_page: parseInt(e.target.value) || 0 })}
              className="input"
              min={form.start_page}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
          <input
            type="number"
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            className="input"
            placeholder="Optionnel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input h-20 resize-none"
            placeholder="Optionnel"
          />
        </div>
        <p className="text-sm text-gray-500">
          Pages lues: {Math.max(0, form.end_page - form.start_page)}
        </p>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || form.end_page <= form.start_page}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
