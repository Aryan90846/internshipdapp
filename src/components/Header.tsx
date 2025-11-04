import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { Award } from 'lucide-react';

export const Header = () => {
  return (
    <header className="glass-card sticky top-0 z-50 border-b transition-smooth">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="primary-gradient p-2 rounded-lg transition-smooth group-hover:scale-110">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Aryan Certificate Portal</h1>
              <p className="text-xs text-muted-foreground">Blockchain-Verified Credentials</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/verify" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              Verify Certificate
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              Admin Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
};
