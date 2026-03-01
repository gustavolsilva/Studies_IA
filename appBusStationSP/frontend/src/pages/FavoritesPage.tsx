import { useFavorites } from '../contexts/FavoritesContext';
import { Star, Bus, MapPin, Clock, Navigation, Trash2 } from 'lucide-react';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const {
    favoriteRoutes,
    favoriteStations,
    removeFavoriteRoute,
    removeFavoriteStation,
  } = useFavorites();

  const hasNoFavorites = favoriteRoutes.length === 0 && favoriteStations.length === 0;

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <Star size={32} fill="currentColor" />
            Meus Favoritos
          </h1>
          <p>Acesso rápido às suas rotas e estações preferidas</p>
        </div>

        {hasNoFavorites ? (
          <div className="empty-state">
            <Star size={64} />
            <h3>Nenhum favorito ainda</h3>
            <p>Comece adicionando rotas e estações aos seus favoritos!</p>
          </div>
        ) : (
          <>
            {/* Favorite Routes */}
            {favoriteRoutes.length > 0 && (
              <section className="favorites-section">
                <h2 className="section-title">
                  <Bus size={24} />
                  Rotas Favoritas ({favoriteRoutes.length})
                </h2>
                <div className="routes-grid">
                  {favoriteRoutes.map((route) => (
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
                          <span>{route.origin} → {route.destination}</span>
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
                          onClick={() => removeFavoriteRoute(route.id)}
                          className="btn-remove"
                          title="Remover dos favoritos"
                        >
                          <Trash2 size={16} />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Favorite Stations */}
            {favoriteStations.length > 0 && (
              <section className="favorites-section">
                <h2 className="section-title">
                  <MapPin size={24} />
                  Estações Favoritas ({favoriteStations.length})
                </h2>
                <div className="stations-grid">
                  {favoriteStations.map((station) => {
                    const getStationType = (type: string) => {
                      const types = {
                        terminal: { label: 'Terminal', color: '#48bb78' },
                        stop: { label: 'Ponto', color: '#4299e1' },
                        station: { label: 'Estação', color: '#ed8936' },
                      };
                      return types[type as keyof typeof types] || types.stop;
                    };

                    const stationType = getStationType(station.type);

                    return (
                      <div key={station.id} className="station-card">
                        <div className="station-header">
                          <h3 className="station-name">{station.name}</h3>
                          <span
                            className="station-type"
                            style={{ background: stationType.color }}
                          >
                            {stationType.label}
                          </span>
                        </div>

                        <div className="station-details">
                          <div className="station-detail">
                            <MapPin size={16} />
                            <span>{station.address}</span>
                          </div>
                          <div className="station-detail">
                            <Navigation size={16} />
                            <span>
                              {station.city}, {station.state}
                            </span>
                          </div>
                        </div>

                        <div className="station-actions">
                          <button
                            onClick={() => removeFavoriteStation(station.id)}
                            className="btn-remove"
                            title="Remover dos favoritos"
                          >
                            <Trash2 size={16} />
                            <span>Remover</span>
                          </button>
                          <button className="btn btn-secondary btn-sm">
                            Ver no Mapa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
