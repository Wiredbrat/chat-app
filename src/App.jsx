import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './components/AuthPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import ChatRoute from './routes/ChatRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import useAuth from './store/userStore.js';
import { useSocket } from './hooks/useSocket.js';
import { getUser } from './api/connection.js';
import { useEffect } from 'react';

function App() {
  const auth = useAuth(state => state.user);
  const {setUser, setIsLoggedIn, chatRooms }= useAuth(state => state);
  const navigate = useNavigate();
  // console.log(chatRooms )
  const getUserData = async () => {
    try {
      const user = await getUser();
      if(!user.success) {
        navigate("/login");
        return;
      }
      setUser(user.data);
      setIsLoggedIn(true);
    } catch (error) {
     // console.log(error);
      navigate("/login");
    }
  }
  useEffect(() => {
    getUserData();
  }, [])
  //// console.log(auth)
  useSocket(import.meta.env.VITE_SOCKET_URL);
  // if (auth) return null; // avoid a login-page flash while session is restored
  return (
    <>
      <Routes>
        {/* Public routes — bounce back to the app if already logged in */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* Everything below requires a session */}
        <Route element={<ProtectedRoute auth={auth} />}>
          <Route path="/" element={<AppLayout auth={auth} />}>
            <Route index element={<ChatRoute auth={auth} />} />
            <Route path="chat/:conversationId" element={<ChatRoute auth={auth} />} />
          </Route>
        </Route>

        {/* Fallback for any unknown path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
