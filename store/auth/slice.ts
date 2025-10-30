import api from '@/utils/api/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginResponse, UserData } from './type';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// Helper for token storage
async function putAccessToken(token: string) {
  await AsyncStorage.setItem('accessToken', token);
}
async function putRefreshToken(token: string) {
  await AsyncStorage.setItem('refreshToken', token);
}
async function removeTokens() {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
}

// === LOGIN ===
export const login = createAsyncThunk<
  UserData,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const resData = await api.post<LoginResponse>('/auth/login', { username, password });

    if (!resData) return rejectWithValue('Response dari server kosong');

    if (resData.status === 'success' && resData.data) {
      await putAccessToken(resData.data.accessToken);
      await putRefreshToken(resData.data.refreshToken);
      return resData.data;
    } else {
      return rejectWithValue(resData.message || 'Login gagal');
    }
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Network error');
  }
});

// === LOGOUT ===
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await removeTokens();
      return;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Gagal logout');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: state => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // LOGIN
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Login gagal';
      });

    // LOGOUT
    builder
      .addCase(logout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Gagal logout';
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
