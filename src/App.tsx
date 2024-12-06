import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import StaffLogin from './components/auth/StaffLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Discounts from './pages/Discounts';
import Inventory from './pages/Inventory';
import CreateStore from './pages/CreateStore';
import Stores from './pages/Stores';
import UserManagement from './pages/UserManagement';
import Unauthorized from './pages/Unauthorized';
import { RootState } from './store';
import { PERMISSIONS } from './utils/permissions';

function App() {
  const { token, staff } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're at the root path and authenticated
    if (token && location.pathname === '/') {
      if (staff) {
        navigate(`/stores/${staff.store}/dashboard`);
      } else {
        navigate('/stores');
      }
    }
  }, [token, staff, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={staff ? <Navigate to={`/stores/${staff.store}/dashboard`} replace /> : <Stores />} />
        <Route path="stores" element={staff ? <Navigate to={`/stores/${staff.store}/dashboard`} replace /> : <Stores />} />
        <Route path="stores/create" element={staff ? <Navigate to={`/stores/${staff.store}/dashboard`} replace /> : <CreateStore />} />
        <Route path="stores/:storeId">
          <Route path="dashboard" element={<Dashboard />} />
          <Route 
            path="categories" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="inventory" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                <Inventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="sales" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_SALE}>
                <Sales />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="discounts" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                <Discounts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;