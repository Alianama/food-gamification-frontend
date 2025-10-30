import { combineReducers } from 'redux';
import authReducer from './auth/slice';
import foodReducer from './food/slice';
import profileReducer from './profile/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
  profile: profileReducer,
});

export default rootReducer;
