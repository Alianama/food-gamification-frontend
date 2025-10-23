import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register } from './action';

type RolePermission = {
  id: number;
  permissionId: number;
  permission: {
    id: number;
    name: string;
    description: string;
  };
};

type Role = {
  id: number;
  name: string;
  description: string;
  permissions?: RolePermission[];
};

type AuthData = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  accessToken?: string;
  refreshToken?: string;
};

type AuthState = {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: Omit<AuthData, 'accessToken' | 'refreshToken'> | null;
};

const initialState: AuthState = {
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // LOGIN
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

      // LOGOUT
      .addCase(logout.fulfilled, state => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })

      // REGISTER
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error?.message ?? 'Register failed';
      });
  },
});

export default authSlice.reducer;
