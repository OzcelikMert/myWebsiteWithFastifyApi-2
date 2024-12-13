import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { translationReducer } from './features/translationSlice';
import { appReducer } from './features/appSlice';
import { pageReducer } from './features/pageSlice';


export const makeStore  = () => {
  return configureStore({
    reducer: {
        translationState: translationReducer,
        appState: appReducer,
        pageState: pageReducer
    },
  })
};

export const wrapper = createWrapper(makeStore);
export type IAppStore = ReturnType<typeof makeStore>;
export type IRootState = ReturnType<IAppStore['getState']>;
export type IAppDispatch = IAppStore['dispatch'];