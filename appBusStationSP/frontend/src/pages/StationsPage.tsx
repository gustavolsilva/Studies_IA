import { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Star } from 'lucide-react';
import { stationsAPI } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Station } from '../types';
import './StationsPage.css';

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addFavoriteStation, removeFavoriteStation, isFavoriteStation } = useFavorites();

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stationsAPI.getAll();
      setStations(data);
    } catch (err) {
      setError('Erro ao carregar estações. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (station.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    station.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStationType = (type: string) => {
    const types = {
      terminal: { label: 'Terminal', color: '#48bb78' },
      stop: { label: 'Ponto', color: '#4299e1' },
      station: { label: 'Estação', color: '#ed8936' },
    };
    return types[type as keyof typeof types] || types.stop;
  };

  return (
    <div className="stations-page">
      <div className="container">
        <div className="page-header">
          <h1>Estações e Terminais</h1>
          <p>Encontre pontos de embarque próximos</p>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, endereço ou cidade..."
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
            <button onClick={loadStations} className="btn btn-secondary">
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="results-count">
              {filteredStations.length} {filteredStations.length === 1 ? 'estação encontrada' : 'estações encontradas'}
            </div>

            <div className="stations-grid">
              {filteredStations.map(station => {
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
                        <span>{station.city}, {station.state}</span>
                      </div>
                    </div>

                    <div className="station-actions">
                      <button
                        onClick={() => {
                          if (isFavoriteStation(station.id)) {
                            removeFavoriteStation(station.id);
                          } else {
                            addFavoriteStation(station);
                          }
                        }}
                        className={`btn-favorite ${isFavoriteStation(station.id) ? 'active' : ''}`}
                        title={isFavoriteStation(station.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <Star size={18} fill={isFavoriteStation(station.id) ? 'currentColor' : 'none'} />
                        <span>{isFavoriteStation(station.id) ? 'Favoritado' : 'Favoritar'}</span>
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        Ver no Mapa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStations.length === 0 && (
              <div className="empty-state">
                <MapPin size={64} />
                <h3>Nenhuma estação encontrada</h3>
                <p>Tente ajustar os filtros de busca</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
