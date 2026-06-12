import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Import Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDetailsPage from './pages/WorkerDetailsPage';
import WorkRequestForm from './pages/WorkRequestForm';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div style={{ flex: 1, padding: '24px 5%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer Private Routes */}
              <Route 
                path="/customer-dashboard" 
                element={
                  <ProtectedRoute allowedRole="CUSTOMER">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/workers/:id" 
                element={
                  <ProtectedRoute allowedRole="CUSTOMER">
                    <WorkerDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/request-work/:id" 
                element={
                  <ProtectedRoute allowedRole="CUSTOMER">
                    <WorkRequestForm />
                  </ProtectedRoute>
                } 
              />

              {/* Worker Private Routes */}
              <Route 
                path="/worker-dashboard" 
                element={
                  <ProtectedRoute allowedRole="WORKER">
                    <WorkerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRole="WORKER">
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback to welcome screen */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
