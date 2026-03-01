import axios from 'axios';
import type { Route, Station, ApiResponse, NearbyStation } from '../types';

// Use proxy do Vite em desenvolvimento, URL absoluta em produção
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para posição de ônibus
export interface BusPosition {
  routeCode: string;
  routeName: string;
  busNumber: string;
  latitude: number;
  longitude: number;
  direction: string;
  speed: number;
  timestamp: string;
}

// Interface para geometria de ruta
export interface RouteGeometry {
  latitude: string;
  longitude: string;
}

// Routes API
export const routesAPI = {
  getAll: async (params?: Record<string, any>): Promise<Route[]> => {
    const response = await api.get<ApiResponse<Route[]>>('/api/routes', { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Route> => {
    const response = await api.get<ApiResponse<Route>>(`/api/routes/${id}`);
    if (!response.data.data) throw new Error('Route not found');
    return response.data.data;
  },

  create: async (data: Partial<Route>): Promise<Route> => {
    const response = await api.post<ApiResponse<Route>>('/api/routes', data);
    if (!response.data.data) throw new Error('Failed to create route');
    return response.data.data;
  },

  // Bus tracking
  getBuses: async (routeId: string): Promise<BusPosition[]> => {
    const response = await api.get<{ success: boolean; buses: BusPosition[] }>(`/api/routes/${routeId}/buses`);
    return response.data.buses || [];
  },

  getGeometry: async (routeId: string): Promise<RouteGeometry[]> => {
    const response = await api.get<{ success: boolean; geometry: RouteGeometry[] }>(`/api/routes/${routeId}/geometry`);
    return response.data.geometry || [];
  },
};

// Bus Tracking API
export const busTrackingAPI = {
  getByRoute: async (routeId: string): Promise<BusPosition[]> => {
    return routesAPI.getBuses(routeId);
  },

  getAllLive: async (routeCode?: string): Promise<BusPosition[]> => {
    const response = await api.get<{ success: boolean; buses: BusPosition[] }>('/api/buses/live', {
      params: routeCode ? { routeCode } : {}
    });
    return response.data.buses || [];
  },
};

// Stations API
export const stationsAPI = {
  getAll: async (params?: Record<string, any>): Promise<Station[]> => {
    const response = await api.get<ApiResponse<Station[]>>('/api/stations', { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Station> => {
    const response = await api.get<ApiResponse<Station>>(`/api/stations/${id}`);
    if (!response.data.data) throw new Error('Station not found');
    return response.data.data;
  },

  getNearby: async (lat: number, lon: number, radius: number = 5): Promise<NearbyStation[]> => {
    const response = await api.get<ApiResponse<NearbyStation[]>>('/api/stations/nearby', {
      params: { lat, lon, radius },
    });
    return response.data.data || [];
  },

  create: async (data: Partial<Station>): Promise<Station> => {
    const response = await api.post<ApiResponse<Station>>('/api/stations', data);
    if (!response.data.data) throw new Error('Failed to create station');
    return response.data.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
