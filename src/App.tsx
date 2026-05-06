import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './store/cartStore';
import { AuthProvider } from './store/authStore';
import { ToastProvider } from './store/toastStore';
import { OrderProvider } from './store/orderStore';
import { ReviewProvider } from './store/reviewStore';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ShopMenuPage } from './pages/ShopMenuPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { StudentOrderHistoryPage } from './pages/StudentOrderHistoryPage';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewProvider>
              <HashRouter>
                <div className="min-h-screen bg-surface">
                  <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/student" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <>
                        <Navbar />
                        <StudentDashboard />
                        <BottomNav />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/shop/:id" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <>
                        <Navbar />
                        <ShopMenuPage />
                        <BottomNav />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <>
                        <Navbar />
                        <CartCheckoutPage />
                        <BottomNav />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/confirmation" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <>
                        <Navbar />
                        <OrderConfirmationPage />
                        <BottomNav />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/student/orders" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <>
                        <Navbar />
                        <StudentOrderHistoryPage />
                        <BottomNav />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor" element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <>
                        <Navbar />
                        <VendorDashboard />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <>
                        <Navbar />
                        <AdminAnalyticsPage />
                      </>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </HashRouter>
            </ReviewProvider>
          </OrderProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
