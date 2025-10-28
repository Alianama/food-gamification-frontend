export interface Nutrition {
  calories: string;
  carbohydrate: string;
  fat: string;
  fiber: string;
  protein: string;
  serving_description: string;
  sodium: string;
  sugar: string;
}

export interface NutritionInfo {
  brand_name: string;
  food_description: string;
  food_name: string;
  food_type: string;
  food_url: string;
  nutrition: Nutrition;
}

export interface Predictions {
  nutrition_info: NutritionInfo;
  predicted_food: string;
  timestamp: string;
}

export interface FileInfo {
  originalName: string;
  size: number;
  type: string;
}

export interface FoodDetectionResponse {
  status: string;
  message: string;
  data: {
    predictions: Predictions;
    fileInfo: FileInfo;
    foodHistoryId: number;
    timestamp: string;
  };
}
