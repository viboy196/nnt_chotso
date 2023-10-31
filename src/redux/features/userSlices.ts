import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

export type UsersState = {
  username?: string;
  domain?: string;
};
const initialState = {
  domain: undefined,
  username: undefined,
} as UsersState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut() {
      return initialState;
    },

    setUserState(state, action: PayloadAction<{input: UsersState}>) {
      state = action.payload.input;
      return state;
    },
  },
});
export const {logOut, setUserState} = userSlice.actions;

const persistConfig = {
  key: 'user',
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, userSlice.reducer);
