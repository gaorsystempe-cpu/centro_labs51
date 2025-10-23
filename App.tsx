
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RootDashboardPage from './pages/RootDashboardPage';
import AdminLayout from './pages/AdminLayout';
import StorefrontPage from './pages/StorefrontPage';
import AdminOverview from './components/admin/AdminOverview';
import ProductManager from './components/admin/ProductManager';
import OrderManager from './components/admin/OrderManager';
import Customizer from './components/admin/Customizer';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/root" element={
          <ProtectedRoute allowedRoles={['ROOT']}>
            <RootDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/:storeId" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="customize" element={<Customizer />} />
        </Route>
        <Route path="/store/:storeId" element={<StorefrontPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
