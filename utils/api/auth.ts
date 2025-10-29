import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services';

export async function putAccessToken(token: string): Promise<void> {
  await AsyncStorage.setItem('accessToken', token);
}

export async function putRefreshToken(token: string): Promise<void> {
  await AsyncStorage.setItem('refreshToken', token);
}

export async function getAccessToken(): Promise<string | null> {
  return await AsyncStorage.getItem('accessToken');
}

export async function getRefreshToken(): Promise<string | null> {
  return await AsyncStorage.getItem('refreshToken');
}

export async function clearAccessToken(): Promise<void> {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
}

type LoginPayload = { username: string; password: string };
type LoginResult = {
  status: 'success' | 'error';
  message: string;
  data?: { id: number; username: string; email: string; accessToken: string; refreshToken: string };
};

export async function login({ username, password }: LoginPayload): Promise<LoginResult> {
  const response = await api.post<LoginResult>('/auth/login', { username, password });
  if (response.status === 'success' && response.data) {
    await putAccessToken(response.data.accessToken);
    await putRefreshToken(response.data.refreshToken);
  }
  return response;
}

export async function getOwnProfile() {
  return await api.get<{ status: 'success'; data: unknown }>('/users/me');
}

type RegisterPayload = { username: string; fullName: string; email: string; password: string };
type RegisterResult = {
  status: 'success' | 'error';
  message: string;
  data?: { id: number; username: string; fullName: string; email: string };
};

export async function register(payload: RegisterPayload): Promise<RegisterResult> {
  return await api.post<RegisterResult>('/users/add', payload);
}

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  return await api.post<{ status: string; message: string; data: unknown }>(
    '/auth/change-password',
    { oldPassword, newPassword },
  );
}
