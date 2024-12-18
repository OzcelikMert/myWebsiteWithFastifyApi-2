import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { translationReducer } from './features/translationSlice';
import { appReducer } from './features/appSlice';
import { pageReducer } from './features/pageSlice';
import logger from "redux-logger";

const combinedReducer = combineReducers({
  translationState: translationReducer,
  appState: appReducer,
  pageState: pageReducer
});

const masterReducer: Reducer<any, any> = (state, action) => {
  if(action.type === HYDRATE){
    return {
      ...state,
      ...action.payload
    };
  }else{
    return combinedReducer(state, action);
  }
}

export const makeStore = () => configureStore({
  reducer: masterReducer as typeof combinedReducer,
  devTools: true,
  middleware: (gDM) => process.env.RUN_TYPE !== "production" ? gDM().concat(logger) : gDM()
});


export type IAppStore = ReturnType<typeof makeStore>;
export type IRootState = ReturnType<IAppStore['getState']>;
export type IAppDispatch = IAppStore['dispatch'];
export const wrapper = createWrapper<IAppStore>(makeStore, {debug: true});