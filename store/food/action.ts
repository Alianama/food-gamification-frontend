import { showError } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { FoodDetectionResponse } from './types';
const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const foodDetection = createAsyncThunk<
  FoodDetectionResponse,
  FormData,
  {
    rejectValue: { status: string; message: string };
    state: RootState;
  }
>('food/detect', async (imageData, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const storedToken = await AsyncStorage.getItem('accessToken');
    const accessToken = token || storedToken;

    if (!accessToken) {
      showError('Akses tidak valid, silahkan login ulang!');
      return rejectWithValue({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const response = await fetch(`${API_URL}/character/food-detection`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: imageData,
    });

    const data: FoodDetectionResponse = await response.json();

    if (!response.ok) {
      showError(data.message || 'Gagal mendeteksi makanan');
      return rejectWithValue({
        status: 'error',
        message: data.message,
      });
    }

    return data;
  } catch (error: any) {
    showError('Network error');
    return rejectWithValue({
      status: 'error',
      message: error.message || 'Network error',
    });
  }
});
