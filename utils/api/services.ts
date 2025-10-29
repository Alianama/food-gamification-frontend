import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8000';

class ApiService {
  private api: any;

  constructor(baseURL: string) {
    this.api = axios.create({ baseURL });

    this.api.interceptors.request.use(
      async (config: any) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers = { ...config.headers, Accept: 'application/json' };
        return config;
      },
      (error: any) => {
        console.log(error?.message || 'Request error');
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error?.message || 'Network error';
        console.log(message);
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: any): Promise<T> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: any): Promise<T> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.delete(url, config);
    return response.data;
  }
}

const api = new ApiService(API_URL);
export default api;
