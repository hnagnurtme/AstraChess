import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ChessGamePage } from './pages/ChessGamePage';
import { HistoryPage } from './pages/HistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AuthModal } from './components/AuthModal';
import { ConfirmationModal } from './components/GameModals';
import { UserSession } from './api/api';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState<UserSession | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('astrachess_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('astrachess_user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = (direct: boolean = false) => {
    if (direct === true) {
      localStorage.removeItem('astrachess_user');
      setUser(null);
      setShowAuthModal(true);
    } else {
      setShowLogoutConfirm(true);
    }
  };

  const confirmLogout = () => {
    const isGuest = user?.username === 'guest';
    localStorage.removeItem('astrachess_user');
    setUser(null);
    setShowLogoutConfirm(false);
    if (isGuest) {
      setShowAuthModal(true);
    }
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        user={user} 
        onSuccess={handleLoginSuccess}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
      
      <ConfirmationModal
        show={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        title={t.confirmLogoutTitle}
        message={t.confirmLogoutMessage}
      />
    </BrowserRouter>
  );
}

interface AppRoutesProps {
  user: UserSession | null;
  onSuccess: (user: UserSession) => void;
  onOpenAuth: () => void;
  onLogout: (direct?: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

function AppRoutes({ 
  user, 
  onSuccess, 
  onOpenAuth, 
  onLogout,
  showAuthModal,
  setShowAuthModal
}: AppRoutesProps) {
  const navigate = useNavigate();

  const handleLoginSuccessWithNavigate = (loggedInUser: UserSession) => {
    onSuccess(loggedInUser);
    if (loggedInUser.username === 'guest') {
      navigate('/play');
    }
  };

  // Route Guard Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      useEffect(() => {
        onOpenAuth();
      }, []);
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onPlay={() => navigate('/play')} 
              onNavToHistory={() => navigate('/history')}
              onNavToLeaderboard={() => navigate('/leaderboard')}
              onOpenAuth={onOpenAuth}
              user={user}
              onLogout={onLogout}
            />
          } 
        />
        <Route 
          path="/play" 
          element={
            <ProtectedRoute>
              <ChessGamePage 
                onBack={() => navigate('/')} 
                onNavToHistory={() => navigate('/history')}
                onNavToLeaderboard={() => navigate('/leaderboard')}
                onOpenAuth={onOpenAuth}
                user={user}
                onLogout={onLogout}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <HistoryPage 
                onBack={() => navigate('/')} 
                onPlay={() => navigate('/play')} 
                onNavToLeaderboard={() => navigate('/leaderboard')}
                user={user}
                onOpenAuth={onOpenAuth}
                onLogout={onLogout}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <LeaderboardPage 
                onBack={() => navigate('/')} 
                onPlay={() => navigate('/play')} 
                onNavToHistory={() => navigate('/history')}
                onOpenAuth={onOpenAuth}
                user={user}
                onLogout={onLogout}
              />
            </ProtectedRoute>
          } 
        />
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleLoginSuccessWithNavigate} 
      />
    </>
  );
}
