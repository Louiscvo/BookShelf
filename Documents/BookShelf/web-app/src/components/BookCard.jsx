import { Link } from 'react-router-dom'
import { Star, BookOpen } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || ''

const categoryColors = {
  'A Lire': 'bg-blue-100 text-blue-700',
  'En Cours De Lecture': 'bg-yellow-100 text-yellow-700',
  'Lu': 'bg-green-100 text-green-700',
  'Non Fini': 'bg-red-100 text-red-700',
}

export default function BookCard({ book }) {
  const coverUrl = book.cover_url
    ? `${API_URL}${book.cover_url}`
    : null

  return (
    <Link
      to={`/book/${book.id}`}
      className="card hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="flex gap-4">
        {/* Cover */}
        <div className="w-20 h-28 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <BookOpen size={32} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm truncate">{book.author || 'Auteur inconnu'}</p>

          {/* Category */}
          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${categoryColors[book.shelf_category] || 'bg-gray-100 text-gray-700'}`}>
            {book.shelf_category}
          </span>

          {/* Progress */}
          {book.total_pages > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{book.current_page} / {book.total_pages} pages</span>
                <span>{book.progress_percent}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${book.progress_percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Rating */}
          {book.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
