import React, { useState } from 'react';
import { FaUser, FaLock, FaTimes, FaUserPlus, FaSignInAlt, FaIdCard } from 'react-icons/fa';
import { registerUser, loginUser, UserSession } from '../api/api';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

const AVATARS = ['🧙‍♂️', '🥷', '👑', '🤖', '🦁', '🦊', '🦉', '🦄'];

export function AuthModal({ show, onClose, onSuccess }: AuthModalProps) {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [avatar, setAvatar] = useState('🧙‍♂️');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t.authErrorEmpty);
      return;
    }

    if (tab === 'register') {
      if (!fullname) {
        setError(t.authErrorFullname);
        return;
      }
      if (password !== confirmPassword) {
        setError(t.authErrorPasswordMismatch);
        return;
      }

      try {
        const user = await registerUser(username, password, fullname, avatar);
        localStorage.setItem('astrachess_user', JSON.stringify(user));
        onSuccess(user);
        handleReset();
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Error registering.');
      }
    } else {
      try {
        const user = await loginUser(username, password);
        localStorage.setItem('astrachess_user', JSON.stringify(user));
        onSuccess(user);
        handleReset();
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Error logging in.');
      }
    }
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setFullname('');
    setAvatar('🧙‍♂️');
    setConfirmPassword('');
    setError('');
  };

  const handlePlayAsGuest = () => {
    const guestUser: UserSession = {
      username: 'guest',
      fullname: language === 'vi' ? 'Khách' : 'Guest',
      avatar: '👤',
      wins: 0,
      losses: 0,
      draws: 0
    };
    localStorage.setItem('astrachess_user', JSON.stringify(guestUser));
    onSuccess(guestUser);
    handleReset();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose} title="Close">
          <FaTimes />
        </button>

        {/* Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            <FaSignInAlt /> {t.loginTab}
          </button>
          <button 
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            <FaUserPlus /> {t.registerTab}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="auth-error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label"><FaUser /> {t.username}</label>
            <input 
              type="text" 
              className="auth-input"
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {tab === 'register' && (
            <>
              <div className="input-group">
                <label className="input-label"><FaIdCard /> {t.fullname}</label>
                <input 
                  type="text" 
                  className="auth-input"
                  placeholder={t.fullnamePlaceholder}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{t.chooseAvatar}</label>
                <div className="avatar-selector-grid">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      className={`avatar-option-btn ${avatar === av ? 'active' : ''}`}
                      onClick={() => setAvatar(av)}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label"><FaLock /> {t.password}</label>
            <input 
              type="password" 
              className="auth-input"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {tab === 'register' && (
            <div className="input-group">
              <label className="input-label"><FaLock /> {t.confirmPassword}</label>
              <input 
                type="password" 
                className="auth-input"
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-yellow auth-submit-btn">
            {tab === 'login' ? t.loginTab : t.registerTab}
          </button>

          {tab === 'login' && (
            <>
              <div className="auth-divider">
                <span>{language === 'vi' ? 'HOẶC' : 'OR'}</span>
              </div>
              <button 
                type="button" 
                className="btn btn-white auth-guest-btn"
                onClick={handlePlayAsGuest}
              >
                👤 {t.guestPlayOption}
              </button>
            </>
          )}
        </form>

        <div className="auth-modal-footer">
          {tab === 'login' ? (
            <p>{t.noAccount} <a href="#" onClick={(e) => { e.preventDefault(); setTab('register'); setError(''); }}>{t.registerNow}</a></p>
          ) : (
            <p>{t.hasAccount} <a href="#" onClick={(e) => { e.preventDefault(); setTab('login'); setError(''); }}>{t.loginTab}</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
