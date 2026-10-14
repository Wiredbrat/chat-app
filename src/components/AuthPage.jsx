import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons.jsx';
import { getUser, login, signup } from '../api/connection.js';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../store/userStore.js';
import useAvatarStore from '../store/useAvatarStore.jsx';

// OpenPeeps avatar list (Replace paths with your actual OpenPeeps SVGs or URLs)

function AuthPage() {
  const location = useLocation();
  const avatarOptions = useAvatarStore(state => state.avatarOptions);
  const setUser = useAuth(state => state.setUser);
  const setIsLoggedIn = useAuth(state => state.setIsLoggedIn);
  const [mode, setMode] = useState(location.pathname.slice(1) || 'login'); // 'login' | 'signup'
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res = await login({ username, password });
        if (res.success) {
          toast.success('Login Success');
          await getUser();
          navigate('/');
        } else {
          toast.error(res?.message || 'Something went wrong');
        }
      } else {
        const res = await signup({ username, email, password, avatar: selectedAvatar });
        if (res.success) {
          toast.success('New User Added');
          switchMode('login')
        } else {
          toast.error(res?.message || 'Something went wrong');
        }
      }
    } catch (error) {
      toast.error('Something Went Wrong');
    } finally {
      setUserName('');
      setPassword('');
      setEmail('');
    }
  };

  function switchMode (next) {
    setMode(next);
    navigate(`/${next}`);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="sidebar__brand" style={{ justifyContent: 'center', marginBottom: 4 }}>
          Nimbus
        </div>
        <p className="auth__subtitle">
          {mode === 'login' ? 'Welcome back — log in to continue.' : 'Create an account to get started.'}
        </p>

        {/* Avatar Selector Section */}
        {mode === 'signup' && (
          <div className="auth__avatar-section">
            <span className="auth__avatar-label">Choose your Avatar</span>
            <div className="auth__avatar-grid">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`auth__avatar-item ${selectedAvatar === avatar.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  aria-label={avatar.alt}
                >
                  {avatar.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__field">
            {/* <span>User Name</span>*/}
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              autoComplete="name"
              required
            />
          </label>

          {mode === 'signup' && (
            <label className="auth__field">
              {/* <span>Email</span>*/}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
          )}

          <label className="auth__field">
            {/* <span>Password</span>*/}
            <span className="auth__password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={showPassword ? '••••••••' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="auth__password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </span>
          </label>

          <button type="submit" className="auth__submit">
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className="auth__switch">
          {mode === 'login' ? (
            <>
              Don&rsquo;t have an account?{' '}
              <button type="button" onClick={() => switchMode('signup')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default AuthPage;
