import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons.jsx';
import { getUser, login, signup } from '../api/connection.js';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../store/userStore.js';

function AuthPage() {
  const location = useLocation();
  const setUser = useAuth(state => state.setUser);
  const setIsLoggedIn = useAuth(state => state.setIsLoggedIn);
  const [mode, setMode] = useState(location.pathname.slice(1)); // 'login' | 'signup'
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res = await login({username, password});
        console.log(res)
        if(res.success) {
          toast.success('Login Success');
          await getUser();
          navigate('/');
        } else {
          toast.error(res?.message || 'something went wrong');
        }
      } else {
        const res = await signup({username, email, password});
        console.log(res)

        if(res.success) {
          toast.success('New User Added')
          navigate('/login');
        } else {
          toast.error(res?.message || 'something went wrong');
        }
      }
    } catch (error) {
     // console.error(error)
      toast.error('Something Went Wrong')
    } finally {
      setUserName("")
      setPassword("")
      setEmail("")
    }
  };

  const switchMode = (next) => {
    setMode(next);
    navigate(`/${next}`);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="sidebar__brand" style={{ justifyContent: 'center', marginBottom: 4 }}>
          {/* <span className="sidebar__brand-mark">N</span> */}
          Nimbus
        </div>
        <p className="auth__subtitle">
          {mode === 'login' ? 'Welcome back — log in to continue.' : 'Create an account to get started.'}
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>

            <label className="auth__field">
              <span>User Name</span>
              <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />
            </label>
          {mode === 'signup' && (
          <label className="auth__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          )}

          <label className="auth__field">
            <span>Password</span>
            <span className="auth__password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={showPassword ? '••••••••': 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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

          {/* {auth.error && <p className="auth__error">{auth.error}</p>} */}

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
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}

export default AuthPage;
