import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILanguageKeys } from 'types/constants/languageKeys';
import { IComponentGetResultService } from 'types/services/component.service';

export interface ITranslationState {
  resources: { [key: string]: string };
}

const initialState: ITranslationState = {
  resources: {},
};

const translationSlice = createSlice({
  name: 'translationState',
  initialState,
  reducers: {
    setTranslationState: (
      state,
      action: PayloadAction<IComponentGetResultService>
    ) => {
      state.resources =
        action.payload.elements.reduce(
          (a, v) => ({
            ...a,
            [v.key]: v.contents?.content || '',
          }),
          {}
        ) || {};
    },
  },
});

export const { setTranslationState } = translationSlice.actions;

export const translationReducer = translationSlice.reducer;

export const selectResources = (state: {
  translationState: ITranslationState;
}) => state.translationState.resources;

export const selectTranslation = createSelector(
  [selectResources],
  (resources) =>
    (
      key: ILanguageKeys,
      variables?: string[] | { [key: string]: string }
    ): string => {
      let item = resources[key] || key;
      if (variables) {
        if (Array.isArray(variables)) {
          for (let index = 0; index < variables.length; index++) {
            item = item.replace(`{{${index}}}`, variables[index]);
          }
        } else {
          Object.keys(variables).forEach((variableKey) => {
            item = item.replace('{{${variableKey}}}', variables[variableKey]);
          });
        }
      }
      return item;
    }
);
