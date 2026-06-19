import { api } from '@/utils/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AdminState,
  AdminUser,
  CreateUserPayload,
  LeaderboardEntry,
  Pagination,
  UpdateUserPayload,
} from './types';

const initialState: AdminState = {
  users: [],
  pagination: null,
  usersLoading: false,
  usersError: null,

  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,

  mutationLoading: false,
  mutationError: null,
  mutationSuccess: false,

  leaderboard: [],
  leaderboardLoading: false,
  leaderboardError: null,
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const asyncAdminGetAllUsers = createAsyncThunk<
  { users: AdminUser[]; pagination: Pagination },
  { page?: number; limit?: number; search?: string },
  { rejectValue: string }
>('admin/getAllUsers', async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });
    const res = await api.get<any>(`/users?${params.toString()}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Gagal mengambil data user');
  }
});

export const asyncAdminGetUserById = createAsyncThunk<
  AdminUser,
  number,
  { rejectValue: string }
>('admin/getUserById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get<any>(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Gagal mengambil detail user');
  }
});

export const asyncAdminCreateUser = createAsyncThunk<
  AdminUser,
  CreateUserPayload,
  { rejectValue: string }
>('admin/createUser', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<any>('/users/add', payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || 'Gagal membuat user');
  }
});

export const asyncAdminUpdateUser = createAsyncThunk<
  AdminUser,
  { id: number; data: UpdateUserPayload },
  { rejectValue: string }
>('admin/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<any>(`/users/${id}`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || 'Gagal mengupdate user');
  }
});

export const asyncAdminDeleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await api.delete<any>(`/users/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || 'Gagal menghapus user');
  }
});

export const asyncAdminResetPassword = createAsyncThunk<
  void,
  { id: number; newPassword: string },
  { rejectValue: string }
>('admin/resetPassword', async ({ id, newPassword }, { rejectWithValue }) => {
  try {
    await api.put<any>(`/users/${id}/reset-password`, { newPassword });
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || 'Gagal reset password');
  }
});

export const asyncAdminGetLeaderboard = createAsyncThunk<
  LeaderboardEntry[],
  void,
  { rejectValue: string }
>('admin/getLeaderboard', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<any>('/users/leaderboard');
    return res.data as LeaderboardEntry[];
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Gagal mengambil leaderboard');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearMutationState(state) {
      state.mutationLoading = false;
      state.mutationError = null;
      state.mutationSuccess = false;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.selectedUserError = null;
    },
  },
  extraReducers: builder => {
    // ── Get All Users ──
    builder
      .addCase(asyncAdminGetAllUsers.pending, state => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(
        asyncAdminGetAllUsers.fulfilled,
        (state, action: PayloadAction<{ users: AdminUser[]; pagination: Pagination }>) => {
          state.usersLoading = false;
          state.users = action.payload.users;
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(asyncAdminGetAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || 'Gagal mengambil data user';
      });

    // ── Get User By ID ──
    builder
      .addCase(asyncAdminGetUserById.pending, state => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(asyncAdminGetUserById.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(asyncAdminGetUserById.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUserError = action.payload || 'Gagal mengambil detail user';
      });

    // ── Create User ──
    builder
      .addCase(asyncAdminCreateUser.pending, state => {
        state.mutationLoading = true;
        state.mutationError = null;
        state.mutationSuccess = false;
      })
      .addCase(asyncAdminCreateUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        state.users = [action.payload, ...state.users];
      })
      .addCase(asyncAdminCreateUser.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || 'Gagal membuat user';
      });

    // ── Update User ──
    builder
      .addCase(asyncAdminUpdateUser.pending, state => {
        state.mutationLoading = true;
        state.mutationError = null;
        state.mutationSuccess = false;
      })
      .addCase(asyncAdminUpdateUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        state.selectedUser = action.payload;
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(asyncAdminUpdateUser.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || 'Gagal mengupdate user';
      });

    // ── Delete User ──
    builder
      .addCase(asyncAdminDeleteUser.pending, state => {
        state.mutationLoading = true;
        state.mutationError = null;
        state.mutationSuccess = false;
      })
      .addCase(asyncAdminDeleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(asyncAdminDeleteUser.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || 'Gagal menghapus user';
      });

    // ── Reset Password ──
    builder
      .addCase(asyncAdminResetPassword.pending, state => {
        state.mutationLoading = true;
        state.mutationError = null;
        state.mutationSuccess = false;
      })
      .addCase(asyncAdminResetPassword.fulfilled, state => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
      })
      .addCase(asyncAdminResetPassword.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || 'Gagal reset password';
      });

    // ── Leaderboard ──
    builder
      .addCase(asyncAdminGetLeaderboard.pending, state => {
        state.leaderboardLoading = true;
        state.leaderboardError = null;
      })
      .addCase(
        asyncAdminGetLeaderboard.fulfilled,
        (state, action: PayloadAction<LeaderboardEntry[]>) => {
          state.leaderboardLoading = false;
          state.leaderboard = action.payload;
        },
      )
      .addCase(asyncAdminGetLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboardError = action.payload || 'Gagal mengambil leaderboard';
      });
  },
});

export const { clearMutationState, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
