import { Link, useLocation } from 'react-router-dom';
import { Home, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Don't show header on embed pages
  if (location.pathname.startsWith('/embed/')) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="floating-header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <Bot className="logo-icon" />
            <span className="logo-text">ChatBot AI</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link 
            to={user ? "/dashboard" : "/"} 
            className={`nav-link ${isActive(user ? '/dashboard' : '/') ? 'active' : ''}`}
          >
            <Home size={18} />
            {user ? 'Dashboard' : 'Home'}
          </Link>
          {user && (
            <Link 
              to="/builder" 
              className={`nav-link ${isActive('/builder') ? 'active' : ''}`}
            >
              <Bot size={18} />
              Create Bot
            </Link>
          )}
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-section">
              <span className="user-name">Welcome, {user.name}</span>
              <button onClick={logout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/signup" className="auth-link primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
