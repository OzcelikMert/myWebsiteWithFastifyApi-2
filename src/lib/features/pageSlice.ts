import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComponentGetResultService } from 'types/services/component.service';
import { IPostGetOneResultService } from 'types/services/post.service';

export type IPageState = {
  isSitemap: boolean;
  page?: IPostGetOneResultService | null;
  publicComponents: IComponentGetResultService[];
  privateComponents: IComponentGetResultService[];
};

const initialState: IPageState = {
  isSitemap: false,
  page: null,
  privateComponents: [],
  publicComponents: []
}

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setIsSitemapState(state, action: PayloadAction<IPageState["isSitemap"]>) {
      state.isSitemap = action.payload;
    },
    setPageState(state, action: PayloadAction<IPageState["page"]>) {
      state.page = action.payload;
    },
    setPrivateComponentsState(state, action: PayloadAction<IPageState["privateComponents"]>) {
      state.privateComponents = action.payload;
    },
    setPublicComponentsState(state, action: PayloadAction<IPageState["publicComponents"]>) {
      state.publicComponents = action.payload;
    },
  },
});

export const { setIsSitemapState, setPageState, setPrivateComponentsState, setPublicComponentsState } = pageSlice.actions;
export const pageReducer = pageSlice.reducer;