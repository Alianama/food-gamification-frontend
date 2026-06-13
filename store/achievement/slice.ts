import { api } from '@/utils/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AchievementProgress {
  current: number;
  max: number;
  percentage: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconFamily: string;
  color: string;
  category: string;
  unlocked: boolean;
  progress: AchievementProgress;
}

export interface AchievementSummary {
  total: number;
  unlocked: number;
  locked: number;
}

export interface AchievementData {
  achievements: Achievement[];
  summary: AchievementSummary;
}

interface AchievementState {
  loading: boolean;
  data: AchievementData | null;
  error: string | null;
}

const initialState: AchievementState = {
  loading: false,
  data: null,
  error: null,
};

export const asyncGetAchievements = createAsyncThunk<
  AchievementData,
  void,
  { rejectValue: string }
>('achievement/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ data: AchievementData }>('/character/achievements');
    return (res as any).data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal mendapatkan achievements';
    return rejectWithValue(message);
  }
});

const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    clearAchievements(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(asyncGetAchievements.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncGetAchievements.fulfilled, (state, action: PayloadAction<AchievementData>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(asyncGetAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Gagal mendapatkan achievements';
      });
  },
});

export const { clearAchievements } = achievementSlice.actions;
export default achievementSlice.reducer;
