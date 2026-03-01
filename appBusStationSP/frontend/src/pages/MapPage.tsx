import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Navigation, Clock, Bus } from 'lucide-react';
import { routesAPI, stationsAPI } from '../services/api';
import type { Route, Station } from '../types';
import type { BusPosition, RouteGeometry } from '../services/api';
import './MapPage.css';

// Mapa usando Google Maps API ou fallback para imagem estática
declare global {
  interface Window {
    google?: any;
  }
}

interface BusMarker extends BusPosition {
  id: string;
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const routePolyline = useRef<any | null>(null);
  const [searchParams] = useSearchParams();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [buses, setBuses] = useState<BusMarker[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometry[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);

  // São Paulo center coordinates
  const saoPaulo = { lat: -23.55052, lng: -46.633308 };

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Carregar rotas em tempo real quando selecionar uma
  useEffect(() => {
    if (!selectedRoute) return;

    const fetchBusData = async () => {
      try {
        const [buses, geometry] = await Promise.all([
          routesAPI.getBuses(selectedRoute.id),
          routesAPI.getGeometry(selectedRoute.id)
        ]);

        setBuses(buses.map((b, i) => ({
          ...b,
          id: `${b.busNumber}-${i}`
        })));
        setRouteGeometry(geometry);
      } catch (error) {
        console.error('Erro ao carregar dados de ônibus:', error);
      }
    };

    fetchBusData();

    // Atualizar a cada 10 segundos se autoRefresh estiver ativo
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoRefresh) {
      interval = setInterval(fetchBusData, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedRoute, autoRefresh]);

  // Inicializar o mapa quando dados forem carregados
  useEffect(() => {
    if (loading || !mapContainer.current) return;

    if (window.google) {
      initGoogleMap();
      setUseGoogleMaps(true);
    } else {
      loadGoogleMapsScript();
    }
  }, [loading]);

  // Atualizar marcadores quando buses ou stations mudam
  useEffect(() => {
    if (!map.current || !useGoogleMaps) return;
    updateMapMarkers();
  }, [buses, stations, routeGeometry, useGoogleMaps]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [routesData, stationsData] = await Promise.all([
        routesAPI.getAll(),
        stationsAPI.getAll()
      ]);

      setRoutes(routesData);
      setStations(stationsData);

      const routeId = searchParams.get('routeId');
      if (routeId) {
        const routeFromQuery = routesData.find((route) => route.id === routeId);
        if (routeFromQuery) {
          setSelectedRoute(routeFromQuery);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleMapsScript = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('Google Maps API key não configurada');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setUseGoogleMaps(true);
      initGoogleMap();
    };
    document.head.appendChild(script);
  };

  const initGoogleMap = () => {
    if (!mapContainer.current || !window.google) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      center: saoPaulo,
      zoom: 12,
      styles: [
        {
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });
  };

  const updateMapMarkers = () => {
    if (!map.current || !window.google) return;

    // Limpar marcadores e polilinha antigos
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    if (routePolyline.current) {
      routePolyline.current.setMap(null);
      routePolyline.current = null;
    }

    // Adicionar marcadores de estações
    stations
      .filter(station => {
        const lat = parseFloat(station.latitude);
        const lng = parseFloat(station.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      })
      .forEach(station => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(station.latitude),
            lng: parseFloat(station.longitude)
          },
          map: map.current,
          title: station.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: '#4CAF50',
            fillOpacity: 0.7,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0;">${station.name}</h3>
              <p style="margin: 0; font-size: 12px;">${station.address || 'Endereço não disponível'}</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">${station.type?.toUpperCase()}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map.current, marker);
        });

        markers.current.push(marker);
      });

    // Adicionar marcadores de ônibus
    buses.forEach(bus => {
      if (isNaN(bus.latitude) || isNaN(bus.longitude)) return;

      const marker = new window.google.maps.Marker({
        position: {
          lat: bus.latitude,
          lng: bus.longitude
        },
        map: map.current,
        title: `Ônibus ${bus.busNumber}`,
        icon: {
          path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
          scale: 1.5,
          fillColor: '#FF9800',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 1
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <p style="margin: 0 0 4px 0; font-weight: bold;">Ônibus ${bus.busNumber}</p>
            <p style="margin: 0 0 2px 0; font-size: 12px;">Linha: ${bus.routeCode}</p>
            <p style="margin: 0 0 2px 0; font-size: 12px;">Velocidade: ${bus.speed} km/h</p>
            <p style="margin: 0; font-size: 11px; color: #999;">${new Date(bus.timestamp).toLocaleTimeString()}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker);
      });

      markers.current.push(marker);
    });

    // Adicionar polyline da rota
    if (routeGeometry.length > 0 && selectedRoute) {
      const path = routeGeometry
        .map(point => ({
          lat: parseFloat(point.latitude),
          lng: parseFloat(point.longitude)
        }))
        .filter(p => !isNaN(p.lat) && !isNaN(p.lng));

      if (path.length > 1) {
        routePolyline.current = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: selectedRoute.line_color || '#667eea',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          map: map.current
        });

        const bounds = new window.google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.current.fitBounds(bounds);
      }
    }
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
  };

  const filteredRoutes = routes.filter(route => {
    const search = searchTerm.toLowerCase();
    return (
      (route.name || '').toLowerCase().includes(search) ||
      (route.code || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="container">
          <h1>Mapa de Rotas e Ônibus</h1>
          <p>Visualize as rotas e rastreie os ônibus em tempo real</p>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-sidebar">
          <div className="sidebar-section">
            <h3>Selecione uma Rota</h3>
            <div className="search-box-sidebar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar rota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="routes-list">
              {filteredRoutes.map(route => (
                <div
                  key={route.id}
                  className={`route-item ${selectedRoute?.id === route.id ? 'active' : ''}`}
                  onClick={() => handleRouteSelect(route)}
                  style={{
                    borderLeft: `4px solid ${route.line_color || '#999'}`
                  }}
                >
                  <div className="route-code">{route.code}</div>
                  <div className="route-info">
                    <p className="route-name">{route.name}</p>
                    <p className="route-origin">
                      {route.origin && route.destination
                        ? `${route.origin} → ${route.destination}`
                        : 'Trajeto não disponível'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedRoute && (
            <div className="sidebar-section">
              <div className="buses-header">
                <h4>
                  <Bus size={16} /> Ônibus em Circulação
                </h4>
                <label className="auto-refresh">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <span>Auto-atualizar</span>
                </label>
              </div>

              <div className="buses-count">
                {buses.length} ônibus circulando
              </div>

              <div className="buses-list">
                {buses.map(bus => (
                  <div key={bus.id} className="bus-item">
                    <div className="bus-number">{bus.busNumber}</div>
                    <div className="bus-info">
                      <p>{bus.speed} km/h</p>
                      <p className="bus-time">
                        <Clock size={12} />
                        {new Date(bus.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="map-container" ref={mapContainer}>
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          {!useGoogleMaps && !loading && (
            <div className="map-placeholder">
              <Navigation size={64} />
              <h3>Mapa não disponível</h3>
              <p>Configure sua chave do Google Maps em VITE_GOOGLE_MAPS_API_KEY</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
