import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import RoomListPage from './pages/RoomListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import { isAuth } from './service/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; 

function ProtectedRoute({ children }) {
  return isAuth() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/rooms" element={<ProtectedRoute><RoomListPage /></ProtectedRoute>} />
        <Route path="/chat/:roomId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={isAuth() ? '/rooms' : '/login'} replace />} />
      </Routes>
      
    </>
  );
}
