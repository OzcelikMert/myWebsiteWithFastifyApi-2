import { IncomingMessage, ServerResponse } from 'http';
import { setCookie } from 'cookies-next';
import { IAppStore } from '@lib/store';

const setLangId = (
  store: IAppStore,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  setCookie('langId', store.getState().appState.selectedLangId, {
    req,
    res,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    path: '/',
  });
};

const deleteLangId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  setCookie('langId', null, { req, res, maxAge: 0, httpOnly: true, path: '/' });
};

export const CookieSSRUtil = {
  setLangId: setLangId,
  deleteLangId: deleteLangId,
};
