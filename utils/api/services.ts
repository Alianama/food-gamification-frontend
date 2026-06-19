import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({ baseURL, timeout: 60000 });

    this.api.interceptors.request.use(
      async (config: any) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Always accept JSON responses
        config.headers = { ...config.headers, Accept: 'application/json' };
        // If sending FormData, let axios/RN set correct boundary; just set content-type hint
        const isFormData =
          typeof FormData !== 'undefined' && config.data && config.data instanceof FormData;
        if (isFormData) {
          config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
      },
      (error: any) => {
        console.log(error?.message || 'Request error');
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError) => {
        const hasResponse = !!error.response;
        const method = (error.config?.method || 'GET').toUpperCase();
        const urlPath = error.config?.url || '';
        const baseURL = error.config?.baseURL || API_URL;
        const fallbackMessage = 'Network error';

        const serverMessage = hasResponse
          ? (error.response?.data as any)?.message ||
            (error.response?.data as any)?.error ||
            error.message ||
            fallbackMessage
          : `${fallbackMessage}: ${method} ${baseURL}${urlPath}`;

        const normalizedError: any = new Error(serverMessage);
        normalizedError.status = error.response?.status;
        normalizedError.code = (error as any).code;
        normalizedError.response = error.response;
        normalizedError.method = method;
        normalizedError.url = `${baseURL}${urlPath}`;

        console.log(serverMessage);
        return Promise.reject(normalizedError);
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
