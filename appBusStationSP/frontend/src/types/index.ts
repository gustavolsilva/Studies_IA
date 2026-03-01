export interface Route {
  id: string;
  code: string;
  name: string;
  operator: string;
  origin: string | null;
  destination: string | null;
  distance_km: number;
  avg_duration_minutes: number;
  line_color: string;
  total_vehicles: number | null;
  is_active: boolean;
  external_id: string | null;
  external_data: any;
  created_at: string;
  updated_at: string;
}

export interface Station {
  id: string;
  name: string;
  address: string | null;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  type: 'terminal' | 'stop' | 'station' | string;
  is_active: boolean;
  external_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

export interface NearbyStation extends Station {
  distance?: number;
}

export interface SearchFilters {
  query?: string;
  operator?: string;
  type?: string;
  is_active?: boolean;
}
