import { configureStore } from '@reduxjs/toolkit';
import { useReducer } from 'react';
import userReducer from './userSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
