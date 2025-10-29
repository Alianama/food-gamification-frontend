export interface CharacterStats {
  id: number;
  level: number;
  statusName: string;
  healthPoint: number;
  xpToNextLevel: number;
  xpPoint: number;
}

export interface FoodDetectionResponse {
  status: string;
  message: string;
  data: {
    foodHistoryId: number;
    character: CharacterStats;
  };
}

export interface FoodState {
  loading: boolean;
  predictedData: FoodDetectionResponse | null;
  confirmedData: FoodDetectionResponse | null;
  stats: FoodStatsResponse | null;
  error: string | null;
  confirmSuccess: boolean;
}

// ---- Character aggregated stats (getCharacterStats) ----
export interface FoodPeriod {
  days: number;
  startDate: string;
  endDate: string;
}

export interface FoodSummaryTotals {
  totalEntries: number;
  totalCalories: number;
  totalCarbohydrate: number;
  totalFat: number;
  totalFiber: number;
  totalProtein: number;
  totalSodium: number;
  totalSugar: number;
}

export interface FoodAverages {
  calories: number;
  carbohydrate: number;
  fat: number;
  fiber: number;
  protein: number;
  sodium: number;
  sugar: number;
}

export interface FoodHealthStatus {
  weeklyScore: number;
  status: string;
}

export interface MostConsumedFoodItem {
  foodName: string;
  count: number;
}

export interface DailyBreakdownItem {
  date: string;
  count: number;
  calories: number;
  foods: string[];
}

export interface FoodStatsData {
  period: FoodPeriod;
  summary: FoodSummaryTotals;
  averages: FoodAverages;
  nutritionRecommendations: string[];
  healthRecommendations: string[];
  health: FoodHealthStatus;
  character: {
    id: number;
    level: number;
    statusName: string;
    healthPoint: number;
    xpToNextLevel: number;
    xpPoint: number;
  };
  mostConsumedFoods: MostConsumedFoodItem[];
  dailyBreakdown: DailyBreakdownItem[];
}

export interface FoodStatsResponse {
  status: string;
  message: string;
  data: FoodStatsData;
}
