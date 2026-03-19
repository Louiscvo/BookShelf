import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BookOpen, Clock, TrendingUp, Target } from 'lucide-react'
import { reading, books } from '../api'
import Navbar from '../components/Navbar'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

const COLORS = ['#ee7a1b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6']

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [bookList, setBookList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, booksRes] = await Promise.all([
        reading.getStats(),
        books.getAll()
      ])
      setStats(statsRes.data)
      setBookList(booksRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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

  // Stats cards
  const statsCards = [
    {
      icon: BookOpen,
      label: 'Livres lus',
      value: stats?.books_read || 0,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Clock,
      label: 'En cours',
      value: stats?.books_reading || 0,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Target,
      label: 'À lire',
      value: stats?.books_to_read || 0,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Pages lues',
      value: stats?.total_pages_read || 0,
      color: 'bg-primary-100 text-primary-600'
    }
  ]

  // Category distribution
  const categoryData = [
    { name: 'Lu', value: stats?.books_read || 0 },
    { name: 'En cours', value: stats?.books_reading || 0 },
    { name: 'À lire', value: stats?.books_to_read || 0 },
  ].filter(d => d.value > 0)

  // Daily reading data (last 30 days)
  const dailyData = stats?.daily_stats?.map(d => ({
    date: format(new Date(d.date), 'd MMM', { locale: fr }),
    pages: d.pages_read
  })) || []

  // Monthly reading data
  const monthlyData = stats?.monthly_stats?.map(d => ({
    month: format(new Date(d.year, d.month - 1), 'MMM yyyy', { locale: fr }),
    pages: d.total_pages,
    books: d.books_finished
  })) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Statistiques</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <div key={i} className="card">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily reading */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Pages lues (30 derniers jours)</h3>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pages" fill="#ee7a1b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                Pas encore de données
              </div>
            )}
          </div>

          {/* Category distribution */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Répartition des livres</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                Ajoutez des livres pour voir les stats
              </div>
            )}
          </div>
        </div>

        {/* Monthly stats */}
        {monthlyData.length > 0 && (
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Historique mensuel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="pages" name="Pages" fill="#ee7a1b" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="books" name="Livres terminés" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Reading streak */}
        {stats?.current_streak > 0 && (
          <div className="mt-6 card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.current_streak} jours</p>
                <p className="opacity-90">Série de lecture en cours !</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
