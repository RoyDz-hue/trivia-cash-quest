
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, User, Award, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Don't show navigation for landing page or auth pages
  const showNavigation = user && 
    !['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-trivia-background">
      {showNavigation && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-trivia-primary to-trivia-secondary font-bold text-xl">
                TriviaCash
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-3">
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'text-trivia-primary' : 'text-gray-600 hover:text-trivia-primary'}`}>
                  Dashboard
                </Link>
                <Link to="/leaderboard" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/leaderboard' ? 'text-trivia-primary' : 'text-gray-600 hover:text-trivia-primary'}`}>
                  Leaderboard
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/profile' ? 'text-trivia-primary' : 'text-gray-600 hover:text-trivia-primary'}`}>
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/admin') ? 'text-trivia-primary' : 'text-gray-600 hover:text-trivia-primary'}`}>
                    Admin
                  </Link>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={logout} 
                className="flex items-center gap-1 text-sm"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      {showNavigation && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
          <div className="flex justify-around py-3">
            <Link to="/dashboard" className={`flex flex-col items-center text-xs ${location.pathname === '/dashboard' ? 'text-trivia-primary' : 'text-gray-600'}`}>
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/leaderboard" className={`flex flex-col items-center text-xs ${location.pathname === '/leaderboard' ? 'text-trivia-primary' : 'text-gray-600'}`}>
              <Award size={20} />
              <span>Leaderboard</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center text-xs ${location.pathname === '/profile' ? 'text-trivia-primary' : 'text-gray-600'}`}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/admin') ? 'text-trivia-primary' : 'text-gray-600'}`}>
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
