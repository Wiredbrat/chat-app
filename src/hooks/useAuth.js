import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nimbus_session';
const USERS_KEY = 'nimbus_users';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

/**
 * Lightweight auth simulation for a frontend-only project. Accounts are
 * stored in localStorage (`nimbus_users`); the active session is stored
 * separately (`nimbus_session`) so a refresh keeps the user logged in.
 *
 * Swap this out for real calls to your auth API/provider when a backend
 * is available — see README "Connecting a backend".
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) setUser(saved);
    } catch {
      // ignore corrupt storage
    }
    setLoading(false);
  }, []);

  const signup = useCallback((name, email, password) => {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in every field.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with that email already exists.');
      return false;
    }
    const newUser = { name: name.trim(), email: email.trim(), password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const session = { name: newUser.name, email: newUser.email, initials: initials(newUser.name) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return true;
  }, []);

  const login = useCallback((email, password) => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return false;
    }
    const users = readUsers();
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) {
      setError('Invalid email or password.');
      return false;
    }
    const session = { name: match.name, email: match.email, initials: initials(match.name) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, loading, error, setError, login, signup, logout };
}
