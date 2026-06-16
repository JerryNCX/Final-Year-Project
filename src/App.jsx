import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/App.css'
import { AuthProvider } from '@/features/auth/hooks/useAuth'
import { BuildProvider } from '@/stores/BuildContext'
import { CartProvider } from '@/stores/CartContext'
import HomePage from '@/features/home/pages/HomePage'
import CategoryPage from '@/features/catalog/pages/CategoryPage'
import ProductCatalog from '@/features/catalog/pages/ProductCatalog'
import ProductDetail from '@/features/catalog/pages/ProductDetail'
import ShoppingCart from '@/features/cart/pages/ShoppingCart'
import Checkout from '@/features/cart/pages/Checkout'
import PaymentPage from '@/features/cart/pages/PaymentPage'
import OrderConfirmation from '@/features/cart/pages/OrderConfirmation'
import Wishlist from '@/features/wishlist/pages/Wishlist'
import LoginPage from '@/features/auth/pages/LoginPage'
import SignUpPage from '@/features/auth/pages/SignUpPage'
import AboutUs from '@/features/about/pages/AboutUs'
import ContactUs from '@/features/contact/pages/ContactUs'
import UserAccount from '@/features/auth/pages/UserAccount'
import AdminLayout from '@/features/admin/components/AdminLayout'
import ProductManagement from '@/features/admin/pages/ProductManagement'
import AdminOrders from '@/features/admin/pages/AdminOrders'
import AdminLogin from '@/features/admin/pages/AdminLogin'
import ProtectedRoute from '@/features/admin/components/ProtectedRoute'
import PCBuildPage from '@/features/builder/pages/PCBuildPage'
import ChooseComponent from '@/features/builder/pages/ChooseComponent'

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
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
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
            <Route path="orders" element={<AdminOrders />} />
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
