import { FoodDetectionResponse } from '@/store/food/types';
import api from './services';

export async function detectFood(imageData: FormData): Promise<FoodDetectionResponse> {
  return await api.post<FoodDetectionResponse>('/character/food-detection', imageData);
}

export async function confirmFood(foodHistoryId: number): Promise<FoodDetectionResponse> {
  return await api.post<FoodDetectionResponse>('/character/food-confirm', {
    foodHistoryId,
    confirm: true,
  });
}
