import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bus, Clock, MapPin, Star, Map } from 'lucide-react';
import { routesAPI } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Route } from '../types';
import './RoutesPage.css';

export default function RoutesPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addFavoriteRoute, removeFavoriteRoute, isFavoriteRoute } = useFavorites();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routesAPI.getAll();
      setRoutes(data);
    } catch (err) {
      setError('Erro ao carregar rotas. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const search = searchTerm.toLowerCase();
    return (
      (route.name || '').toLowerCase().includes(search) ||
      (route.code || '').toLowerCase().includes(search) ||
      (route.origin || '').toLowerCase().includes(search) ||
      (route.destination || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="routes-page">
      <div className="container">
        <div className="page-header">
          <h1>Rotas Disponíveis</h1>
          <p>Encontre a melhor rota para sua viagem</p>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, código, origem ou destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadRoutes} className="btn btn-secondary">
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="results-count">
              {filteredRoutes.length} {filteredRoutes.length === 1 ? 'rota encontrada' : 'rotas encontradas'}
            </div>

            <div className="routes-grid">
              {filteredRoutes.map(route => (
                <div key={route.id} className="route-card">
                  <div className="route-header">
                    <div className="route-code" style={{ background: route.line_color }}>
                      {route.code}
                    </div>
                    <div className="route-operator">{route.operator}</div>
                  </div>

                  <h3 className="route-name">{route.name}</h3>

                  <div className="route-details">
                    <div className="route-detail">
                      <MapPin size={16} />
                      <span>
                        {route.origin && route.destination 
                          ? `${route.origin} → ${route.destination}`
                          : route.origin || route.destination || 'Informação não disponível'}
                      </span>
                    </div>

                    <div className="route-detail">
                      <Bus size={16} />
                      <span>{route.distance_km} km</span>
                    </div>

                    <div className="route-detail">
                      <Clock size={16} />
                      <span>~{route.avg_duration_minutes} min</span>
                    </div>
                  </div>

                  <div className="route-actions">
                    <button
                      onClick={() => navigate(`/map?routeId=${route.id}`)}
                      className="btn-map"
                      title="Ver rota no mapa"
                    >
                      <Map size={18} />
                      Ver no Mapa
                    </button>
                    <button
                      onClick={() => {
                        if (isFavoriteRoute(route.id)) {
                          removeFavoriteRoute(route.id);
                        } else {
                          addFavoriteRoute(route);
                        }
                      }}
                      className={`btn-favorite ${isFavoriteRoute(route.id) ? 'active' : ''}`}
                      title={isFavoriteRoute(route.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star size={18} fill={isFavoriteRoute(route.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {!route.is_active && (
                    <div className="route-status inactive">
                      Rota Inativa
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredRoutes.length === 0 && (
              <div className="empty-state">
                <Bus size={64} />
                <h3>Nenhuma rota encontrada</h3>
                <p>Tente ajustar os filtros de busca</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
