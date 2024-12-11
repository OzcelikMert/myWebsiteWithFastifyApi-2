import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { languageReducer } from './features/languageSlice';


export const makeStore  = () => {
  return configureStore({
    reducer: {
        language: languageReducer
    },
  })
};

export const wrapper = createWrapper(makeStore);
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];