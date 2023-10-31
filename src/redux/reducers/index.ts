import {combineReducers} from 'redux';
import userSlices from '../features/userSlices';

export default combineReducers({
  user: userSlices,
});
