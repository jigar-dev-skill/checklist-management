import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/authSlice';
import { authAPI } from './services';
import store from './store';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import DoctorLayout from './components/DoctorLayout';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManagePatients from './pages/ManagePatients';
import ManageChecklists from './pages/ManageChecklists';
import CreateChecklistTemplate from './pages/CreateChecklistTemplate';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getUser();
          dispatch(setUser(response.data));
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ManageDoctors />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ManagePatients />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/templates"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <CreateChecklistTemplate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <div>Reports Page - Coming Soon</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout>
                <ManagePatients doctorOnly={true} />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/checklists"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout>
                <ManageChecklists />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/reports"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout>
                <div>Reports Page - Coming Soon</div>
              </DoctorLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/doctor/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
