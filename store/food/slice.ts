import { api } from '@/utils/api';
import { confirmFood as apiConfirmFood, detectFood as apiDetectFood } from '@/utils/api/food';
import { showError, showSuccess } from '@/utils/toast';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FoodDetectionResponse, FoodState, FoodStatsResponse } from './types';

export const asyncFoodDetection = createAsyncThunk<
  FoodDetectionResponse,
  FormData,
  { rejectValue: string }
>('food/detect', async (imageData, { rejectWithValue }) => {
  try {
    const res = await apiDetectFood(imageData);
    return res;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal mendeteksi makanan';
    return rejectWithValue(message);
  }
});

export const asyncConfirmFood = createAsyncThunk<
  FoodDetectionResponse,
  number,
  { rejectValue: string }
>('food/confirm', async (foodHistoryId, { rejectWithValue }) => {
  try {
    const res = await apiConfirmFood(foodHistoryId);
    return res;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal mengonfirmasi makanan';
    return rejectWithValue(message);
  }
});

export const asyncGetCharacterStats = createAsyncThunk<
  FoodStatsResponse,
  void,
  { rejectValue: string }
>('food/getCharacterStats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<FoodStatsResponse>('/character/food-stats');
    return res;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Gagal mendapatkan stats karakter';
    return rejectWithValue(message);
  }
});

const initialState: FoodState = {
  loading: false,
  predictedData: null,
  confirmedData: null,
  stats: null,
  error: null,
  confirmSuccess: false,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    clearFoodData(state) {
      state.predictedData = null;
      state.confirmedData = null;
      state.stats = null;
      state.error = null;
      state.confirmSuccess = false;
    },
    clearStats(state) {
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // detect
      .addCase(asyncFoodDetection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        asyncFoodDetection.fulfilled,
        (state, action: PayloadAction<FoodDetectionResponse>) => {
          state.loading = false;
          state.predictedData = action.payload;
          state.error = null;
          showSuccess('Makanan berhasil terdeteksi!');
        },
      )
      .addCase(asyncFoodDetection.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Gagal mendeteksi makanan';
        showError(state.error);
      })
      // confirm
      .addCase(asyncConfirmFood.pending, state => {
        state.loading = true;
        state.confirmSuccess = false;
      })
      .addCase(
        asyncConfirmFood.fulfilled,
        (state, action: PayloadAction<FoodDetectionResponse>) => {
          state.loading = false;
          state.confirmedData = action.payload;
          state.error = null;
          state.confirmSuccess = true;
          showSuccess('Makanan berhasil dikonfirmasi!');
        },
      )
      .addCase(asyncConfirmFood.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Gagal mengonfirmasi makanan';
        showError(state.error);
      })
      // stats
      .addCase(asyncGetCharacterStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        asyncGetCharacterStats.fulfilled,
        (state, action: PayloadAction<FoodStatsResponse>) => {
          state.loading = false;
          state.stats = action.payload;
          state.error = null;
        },
      )
      .addCase(asyncGetCharacterStats.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Gagal mendapatkan stats karakter';
      });
  },
});

export const { clearFoodData } = foodSlice.actions;
export default foodSlice.reducer;
