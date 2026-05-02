import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './frontendReusedComponents/HomePage/HomePage'
import CategoryPage from './frontendReusedComponents/CategoryPage/CategoryPage'
import AdminLayout from './frontendReusedComponents/Admin/AdminLayout'
import ProductManagement from './frontendReusedComponents/Admin/ProductManagement'
import AdminLogin from './frontendReusedComponents/Admin/AdminLogin'
import ProtectedRoute from './frontendReusedComponents/Admin/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="products" element={<ProductManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App