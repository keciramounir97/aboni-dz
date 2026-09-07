import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '@/i18n/I18nProvider';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import HomePage from '@/pages/Home';
import ShopPage from '@/pages/Shop';
import ProductDetailPage from '@/pages/ProductDetail';
import ContactPage from '@/pages/Contact';
import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';
import ForgotPasswordPage from '@/pages/ForgotPassword';
import ResetPasswordPage from '@/pages/ResetPassword';
import OrdersPage from '@/pages/Orders';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProductsPage from '@/pages/admin/AdminProducts';
import AdminOrdersPage from '@/pages/admin/AdminOrders';
import AdminUsersPage from '@/pages/admin/AdminUsers';
import AdminContactsPage from '@/pages/admin/AdminContacts';
import AdminNewsletterPage from '@/pages/admin/AdminNewsletter';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:slug" element={<ProductDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="orders" element={<OrdersPage />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="contacts" element={<AdminContactsPage />} />
              <Route path="newsletter" element={<AdminNewsletterPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
