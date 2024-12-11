import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    resources: {},
  },
  reducers: {
    setLanguageState: (state, action) => {
      state.resources = action.payload.elements.reduce(
        (a: any, v: any) => ({
          ...a,
          [v.key]: v.contents?.content || '',
        }),
        {}
      ) || {};
    },
  },
});

export const { setLanguageState } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;