import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { BuildProvider } from '@/lib/BuildContext'
import { CartProvider } from '@/lib/CartContext'
import HomePage from './frontendReusedComponents/HomePage/HomePage'
import CategoryPage from './frontendReusedComponents/CategoryPage/CategoryPage'
import ProductCatalog from './frontendReusedComponents/Catalog/ProductCatalog'
import ProductDetail from './frontendReusedComponents/Catalog/ProductDetail'
import ShoppingCart from './frontendReusedComponents/Cart/ShoppingCart'
import Checkout from './frontendReusedComponents/Cart/Checkout'
import Wishlist from './frontendReusedComponents/Wishlist/Wishlist'
import LoginPage from './frontendReusedComponents/Auth/LoginPage'
import SignUpPage from './frontendReusedComponents/Auth/SignUpPage'
import AboutUs from './frontendReusedComponents/About/AboutUs'
import ContactUs from './frontendReusedComponents/Contact/ContactUs'
import UserAccount from './frontendReusedComponents/Auth/UserAccount'
import AdminLayout from './frontendReusedComponents/Admin/AdminLayout'
import ProductManagement from './frontendReusedComponents/Admin/ProductManagement'
import AdminLogin from './frontendReusedComponents/Admin/AdminLogin'
import ProtectedRoute from './frontendReusedComponents/Admin/ProtectedRoute'
import PCBuildPage from './frontendReusedComponents/Build/PCBuildPage'
import ChooseComponent from './frontendReusedComponents/Build/ChooseComponent'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BuildProvider>
        <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/product/:tableName/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/build" element={<PCBuildPage />} />
          <Route path="/build/choose/:category" element={<ChooseComponent />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartProvider>
        </BuildProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
