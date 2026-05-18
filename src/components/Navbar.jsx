import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui';

export default function Navbar() {
  const { isRecruiterLoggedIn, logoutRecruiter } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isRecruiterRoute = location.pathname.startsWith('/recruiter');

  const candidateLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/jobs', label: 'Lowongan' },
    { to: '/announcement', label: 'Pengumuman' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/jobs', label: 'Kelola Lowongan' },
  ];

  const links = isRecruiterRoute ? recruiterLinks : candidateLinks;

  const handleLogout = () => {
    logoutRecruiter();
    navigate('/recruiter/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isRecruiterRoute ? '/recruiter/dashboard' : '/'} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">
              Rita<span className="text-primary-600">Screen</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {isRecruiterRoute ? (
              isRecruiterLoggedIn ? (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              ) : null
            ) : (
              <Link to="/recruiter/login">
                <Button variant="secondary" size="sm">Portal Rekruter</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-100 bg-white">
          <div className="flex flex-col gap-1 pt-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isRecruiterRoute && (
              <Link to="/recruiter/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full mt-2">Portal Rekruter</Button>
              </Link>
            )}
            {isRecruiterRoute && isRecruiterLoggedIn && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="mt-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
