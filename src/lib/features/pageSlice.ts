import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComponentGetResultService } from 'types/services/component.service';
import { IPostGetOneResultService } from 'types/services/post.service';

export type IPageState = {
  isSitemap: boolean;
  page?: IPostGetOneResultService | null;
  publicComponents: IComponentGetResultService[];
  privateComponents: IComponentGetResultService[];
  queries: { [key: string]: any };
};

const initialState: IPageState = {
  isSitemap: false,
  page: null,
  privateComponents: [],
  publicComponents: [],
  queries: {},
};

const pageSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    setIsSitemapState(state, action: PayloadAction<IPageState['isSitemap']>) {
      state.isSitemap = action.payload;
    },
    setPageState(state, action: PayloadAction<IPageState['page']>) {
      state.page = Object.assign(state.page || {}, action.payload);
    },
    setPrivateComponentsState(
      state,
      action: PayloadAction<IPageState['privateComponents']>
    ) {
      state.privateComponents = action.payload;
    },
    setPublicComponentsState(
      state,
      action: PayloadAction<IPageState['publicComponents']>
    ) {
      state.publicComponents = action.payload;
    },
    setQueriesState(state, action: PayloadAction<IPageState['queries']>) {
      state.queries = Object.assign(state.queries, action.payload);
    },
  },
});

export const {
  setIsSitemapState,
  setPageState,
  setPrivateComponentsState,
  setPublicComponentsState,
  setQueriesState,
} = pageSlice.actions;
export const pageReducer = pageSlice.reducer;
