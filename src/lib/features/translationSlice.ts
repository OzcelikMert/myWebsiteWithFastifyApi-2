import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILanguageKey } from 'types/constants/languageKeys';
import { IComponentGetResultService } from 'types/services/component.service';

export interface ITranslationState {
  resources: { [key: string]: string }
}

const initialState: ITranslationState = {
  resources: {}
}

const translationSlice = createSlice({
  name: 'translationState',
  initialState,
  reducers: {
    setTranslationState: (state, action: PayloadAction<IComponentGetResultService>) => {
      state.resources = action.payload.elements.reduce(
        (a, v) => ({
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