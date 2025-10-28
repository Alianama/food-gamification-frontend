import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { foodDetection } from './action';
import { FoodDetectionResponse } from './types';

interface FoodState {
  loading: boolean;
  data: FoodDetectionResponse | null;
  error: string | null;
}

const initialState: FoodState = {
  loading: false,
  data: null,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    clearFoodData: state => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(foodDetection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(foodDetection.fulfilled, (state, action: PayloadAction<FoodDetectionResponse>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(foodDetection.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message: string })?.message || 'Terjadi kesalahan jaringan';
      });
  },
});

export const { clearFoodData } = foodSlice.actions;
export default foodSlice.reducer;
