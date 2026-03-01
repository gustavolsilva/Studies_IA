import { Link } from 'react-router-dom';
import { Bus, MapPin, Map, ArrowRight } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            🚌 Transporte Público de São Paulo
          </h1>
          <p className="hero-subtitle">
            Planeje suas viagens com facilidade. Encontre rotas, estações e horários em tempo real.
          </p>
          <div className="hero-actions">
            <Link to="/routes" className="btn btn-primary btn-lg">
              Buscar Rotas
              <ArrowRight size={20} />
            </Link>
            <Link to="/map" className="btn btn-secondary btn-lg">
              Ver Mapa
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <Link to="/routes" className="feature-card">
              <div className="feature-icon">
                <Bus size={32} />
              </div>
              <h3>Rotas</h3>
              <p>Consulte linhas de ônibus, metrô e trem da região metropolitana</p>
            </Link>

            <Link to="/stations" className="feature-card">
              <div className="feature-icon">
                <MapPin size={32} />
              </div>
              <h3>Estações</h3>
              <p>Encontre terminais e pontos de parada próximos a você</p>
            </Link>

            <Link to="/map" className="feature-card">
              <div className="feature-icon">
                <Map size={32} />
              </div>
              <h3>Mapa Interativo</h3>
              <p>Visualize rotas e estações em um mapa detalhado</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">2+</div>
              <div className="stat-label">Rotas Disponíveis</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3+</div>
              <div className="stat-label">Estações</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Disponibilidade</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
