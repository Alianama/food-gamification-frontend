import { showError, showSuccess } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { router } from 'expo-router';
const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: {
      id: number;
      name: string;
      description: string;
      permissions: {
        id: number;
        permissionId: number;
        permission: {
          id: number;
          name: string;
          description: string;
        };
      }[];
    };
    accessToken: string;
    refreshToken: string;
  };
};

type RegisterPayload = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    createdAt: string;
    role: {
      id: number;
      name: string;
      description: string;
    };
  };
};

export const login = createAsyncThunk(
  'user/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        showError(data.message || 'Login gagal');
        return rejectWithValue(data);
      }

      const { accessToken, refreshToken } = data.data;

      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      showSuccess('Login berhasil!');
      return data.data;
    } catch (err: any) {
      const message = err.message || 'Network error';
      showError(message);
      return rejectWithValue({ message });
    }
  },
);

export const register = createAsyncThunk(
  'user/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) {
        showError(data.message || 'Registrasi gagal');
        return rejectWithValue(data);
      }

      showSuccess('Registrasi berhasil!');
      router.replace('/login');
      return data.data;
    } catch (err: any) {
      const message = err.message || 'Network error';
      showError(message);
      return rejectWithValue({ message });
    }
  },
);

export const logout = createAsyncThunk('user/logout', async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  showSuccess('Logout berhasil!');
  return {};
});
