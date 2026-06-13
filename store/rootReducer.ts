import { combineReducers, Action } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import foodReducer from './food/slice';
import profileReducer from './profile/slice';
import achievementReducer from './achievement/slice';

const appReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
  profile: profileReducer,
  achievement: achievementReducer,
});

const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/logout/fulfilled') {
    // Reset seluruh state ke initialState ketika user logout
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
