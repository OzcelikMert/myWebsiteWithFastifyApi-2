import { createSlice } from '@reduxjs/toolkit';
import { ILanguageKey } from 'types/constants/languageKeys';

export interface ITranslationState {
  resources: { [key: string]: string }
}

const initialState: ITranslationState = {
  resources: {}
}

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setTranslationState: (state, action) => {
      state.resources = action.payload.elements.reduce(
        (a: any, v: any) => ({
          ...a,
          [v.key]: v.contents?.content || '',
        }),
        {}
      ) || {};
    },
  },
  selectors: {
    translation: (state) => {
      return (key: ILanguageKey): string => {
        return state.resources[key] || key;
      }
    }
  }
});

export const { setTranslationState } = translationSlice.actions;

export const { translation } = translationSlice.selectors;

export const translationReducer = translationSlice.reducer;