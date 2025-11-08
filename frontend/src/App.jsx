import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import RoomListPage from './pages/RoomListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import './App.css'; 

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={handleLogin} />}
      />
      <Route
        path="/register"
        element={<RegisterPage onRegisterSuccess={handleLogin} />}
      />

      {/* Protected Routes */}
      <Route
        path="/rooms"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RoomListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:roomId" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ChatRoomPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/rooms' : '/login'} replace />
        }
      />
    </Routes>
  );
}