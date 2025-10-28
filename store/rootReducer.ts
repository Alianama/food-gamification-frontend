import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import foodReducer from './food/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
});

export default rootReducer;
