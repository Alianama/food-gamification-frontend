import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import { api } from '../../utils/api';
import { ProfileApiResponse, ProfileData, ProfileState } from './types';

// Perbaikan nama: asyncGetProfile
export const asyncGetProfile = createAsyncThunk<
  ProfileData, // state.data akan bertipe ProfileData
  void,
  { rejectValue: string }
>('profile/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ProfileApiResponse>('/users/me');
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal mendapatkan profil';
    return rejectWithValue(message);
  }
});

export const asyncCreateUser = createAsyncThunk<
  ProfileData,
  {
    username: string;
    fullName: string;
    email: string;
    password: string;
  },
  { rejectValue: string }
>('profile/createUser', async (userData, { rejectWithValue }) => {
  try {
    const res = await api.post<ProfileApiResponse>('/users/add', userData);
    router.replace('/(tabs)');
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal membuat user';
    return rejectWithValue(message);
  }
});

const initialState: ProfileState = {
  loading: false,
  data: null,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(asyncGetProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncGetProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(asyncGetProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Terjadi kesalahan';
      });
  },
});

export default profileSlice.reducer;
