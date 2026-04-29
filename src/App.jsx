import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './frontendReusedComponents/HomePage/HomePage'
import CategoryPage from './frontendReusedComponents/CategoryPage/CategoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App