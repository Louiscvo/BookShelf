import { Link, useLocation } from 'react-router-dom'
import { BookOpen, BarChart2, Library } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', icon: Library, label: 'Bibliothèque' },
    { to: '/stats', icon: BarChart2, label: 'Statistiques' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-primary-500 font-bold text-xl">
              <BookOpen size={28} />
              <span className="hidden sm:inline">BookShelf</span>
            </Link>

            <div className="ml-10 flex items-center gap-1">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === to
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
