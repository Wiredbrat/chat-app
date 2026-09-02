import { Routes, Route, Navigate } from 'react-router-dom';
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
  const setUser = useAuth(state => state.setUser);

  const getUserData = async () => {
    try {
      const user = await getUser();
      console.log(user)
      setUser(user.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserData();
  }, [])
  // console.log(auth)
  // if (auth) return null; // avoid a login-page flash while session is restored
  useSocket(import.meta.env.VITE_SOCKET_URL);
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