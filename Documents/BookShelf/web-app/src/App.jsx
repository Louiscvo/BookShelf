import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Library from './pages/Library'
import BookDetail from './pages/BookDetail'
import Stats from './pages/Stats'

export default function App() {
  return (
    <BrowserRouter basename="/BookShelf">
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
