import { combineReducers } from 'redux';
import authReducer from './auth/slice';
import foodReducer from './food/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
});

export default rootReducer;
