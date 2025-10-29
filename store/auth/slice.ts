import {
  login as apiLogin,
  register as apiRegister,
  clearAccessToken,
  putAccessToken,
  putRefreshToken,
} from '@/utils/api/auth';
import { showError, showSuccess } from '@/utils/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, LoginPayload, RegisterPayload } from './type';

const initialState: AuthState = {
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await apiLogin(payload);
      if (data.status !== 'success' || !data.data) {
        showError(data.message || 'Login gagal');
        return rejectWithValue(data);
      }
      const { accessToken, refreshToken } = data.data;
      await putAccessToken(accessToken!);
      await putRefreshToken(refreshToken!);
      showSuccess('Login berhasil!');
      return data.data;
    } catch (err: any) {
      const message = err?.message || 'Network error';
      showError(message);
      return rejectWithValue({ message });
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await apiRegister(payload);
      if (data.status !== 'success') {
        showError(data.message || 'Registrasi gagal');
        return rejectWithValue(data);
      }
      showSuccess('Registrasi berhasil!');
      return data.data as any;
    } catch (err: any) {
      const message = err?.message || 'Network error';
      showError(message);
      return rejectWithValue({ message });
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await clearAccessToken();
  showSuccess('Logout berhasil!');
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload.accessToken!;
        state.refreshToken = action.payload.refreshToken!;
        const { accessToken, refreshToken, ...userData } = action.payload;
        state.user = userData;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error?.message ?? 'Login failed';
      })
      .addCase(logout.fulfilled, state => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload as any;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error?.message ?? 'Register failed';
      });
  },
});

export default authSlice.reducer;
