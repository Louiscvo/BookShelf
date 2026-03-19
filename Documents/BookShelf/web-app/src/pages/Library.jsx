import { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { books } from '../api'
import BookCard from '../components/BookCard'
import AddBookModal from '../components/AddBookModal'
import Navbar from '../components/Navbar'

const categories = [
  { value: '', label: 'Tous' },
  { value: 'A Lire', label: 'A Lire' },
  { value: 'En Cours De Lecture', label: 'En cours' },
  { value: 'Lu', label: 'Terminés' },
  { value: 'Non Fini', label: 'Abandonnés' },
]

export default function Library() {
  const [bookList, setBookList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const loadBooks = async () => {
    try {
      const res = await books.getAll(category || undefined)
      setBookList(res.data)
    } catch (err) {
      console.error('Erreur chargement livres:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [category])

  const filteredBooks = bookList.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(search.toLowerCase()))
  )

  const handleBookAdded = (newBook) => {
    setBookList([newBook, ...bookList])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ma Bibliothèque</h1>
            <p className="text-gray-500">{bookList.length} livres</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter un livre
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un livre ou un auteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  category === cat.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Chargement...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {search ? 'Aucun livre trouvé' : 'Votre bibliothèque est vide'}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Ajouter votre premier livre
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>

      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookAdded={handleBookAdded}
      />
    </div>
  )
}
