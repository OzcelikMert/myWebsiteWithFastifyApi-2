import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppProps } from 'next/app';
import { ILanguageGetResultService } from 'types/services/language.service';
import { ISettingGetResultService } from 'types/services/setting.service';

export interface ICookies {
  langCode?: string;
  langId?: string;
}

export interface IURL {
  full: string;
  base: string;
  asPath: string;
}

export interface IAppState {
  settings: ISettingGetResultService;
  languages: ILanguageGetResultService[];
  selectedLangId: string;
  selectedLangCode: string;
  defaultLangId: string;
  router: AppProps['router'] | null;
  cookies: ICookies;
  url: IURL;
}

const initialState: IAppState = {
  settings: {},
  languages: [],
  selectedLangId: "",
  selectedLangCode: "",
  defaultLangId: "",
  router: null,
  cookies: {},
  url: {
    full: "",
    asPath: "",
    base: ""
  }
}

const appSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setSettingsState(state, action: PayloadAction<IAppState["settings"]>) {
      state.settings = action.payload;
    },
    setLanguagesState(state, action: PayloadAction<IAppState["languages"]>) {
      state.languages = action.payload;
    },
    setSelectedLangIdState(state, action: PayloadAction<IAppState["selectedLangId"]>) {
      state.selectedLangId = action.payload;
    },
    setSelectedLangCodeState(state, action: PayloadAction<IAppState["selectedLangCode"]>) {
      state.selectedLangCode = action.payload;
    },
    setDefaultLangIdState(state, action: PayloadAction<IAppState["defaultLangId"]>) {
      state.defaultLangId = action.payload;
    },
    setRouterState(state, action: PayloadAction<IAppState["router"]>) {
      state.router = action.payload;
    },
    setCookiesState(state, action: PayloadAction<Partial<IAppState["cookies"]>>) {
      state.cookies = Object.assign(state.cookies, action.payload);
    },
    setURLState(state, action: PayloadAction<Partial<IAppState["url"]>>) {
      state.url = Object.assign(state.url, action.payload);
    }
  }
});

export const { setSettingsState, setLanguagesState, setSelectedLangIdState, setSelectedLangCodeState, setDefaultLangIdState, setRouterState, setCookiesState, setURLState } = appSlice.actions;
export const appReducer = appSlice.reducer;