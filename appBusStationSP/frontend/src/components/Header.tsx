import { Link, useLocation } from 'react-router-dom';
import { Bus, Map, MapPin, Home, Star } from 'lucide-react';
import './Header.css';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <Bus size={28} />
          <span>Bus Station SP</span>
        </Link>

        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Início</span>
          </Link>
          <Link 
            to="/routes" 
            className={`nav-link ${isActive('/routes') ? 'active' : ''}`}
          >
            <Bus size={20} />
            <span>Rotas</span>
          </Link>
          <Link 
            to="/stations" 
            className={`nav-link ${isActive('/stations') ? 'active' : ''}`}
          >
            <MapPin size={20} />
            <span>Estações</span>
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${isActive('/map') ? 'active' : ''}`}
          >
            <Map size={20} />
            <span>Mapa</span>
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
          >
            <Star size={20} />
            <span>Favoritos</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
