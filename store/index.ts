import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { toastMiddleware } from './toastMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(toastMiddleware),
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
