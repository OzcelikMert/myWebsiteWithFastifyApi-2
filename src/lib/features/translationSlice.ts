import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILanguageKeys } from 'types/constants/languageKeys';
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
      return (key: ILanguageKeys): string => {
        return state.resources[key] || key;
      }
    }
  }
});

export const { setTranslationState } = translationSlice.actions;

export const { translation } = translationSlice.selectors;

export const translationReducer = translationSlice.reducer;

export const selectResources = (state: { translationState: ITranslationState }) =>
  state.translationState.resources;

export const selectTranslation = createSelector(
  [selectResources],
  (resources) => (key: ILanguageKeys): string => {
    return resources[key] || key;
  }
);