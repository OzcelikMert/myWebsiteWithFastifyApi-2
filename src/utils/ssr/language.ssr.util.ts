import { LanguageService } from '@services/language.service';
import { StatusId } from '@constants/status';
import { LanguageUtil } from '@utils/language.util';
import { CookieSSRUtil } from '@utils/ssr/cookie.ssr.util';
import { UrlUtil } from '@utils/url.util';
import { IncomingMessage, ServerResponse } from 'http';
import { UrlSSRUtil } from '@utils/ssr/url.ssr.util';
import { IAppStore } from '@lib/store';
import {
  setDefaultLangIdState,
  setLanguagesState,
  setSelectedLangCodeState,
  setSelectedLangIdState,
} from '@lib/features/appSlice';

const init = async (
  store: IAppStore,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  // Get all languages
  const languages =
    (await LanguageService.getMany({ statusId: StatusId.Active })).data ?? [];

  // Find default language
  const foundDefaultLanguage = languages.findSingle('isDefault', true);
  if (foundDefaultLanguage) {
    store.dispatch(setLanguagesState(languages));
    store.dispatch(setDefaultLangIdState(foundDefaultLanguage._id));
    store.dispatch(setSelectedLangIdState(foundDefaultLanguage._id));
    store.dispatch(
      setSelectedLangCodeState(LanguageUtil.getCode(foundDefaultLanguage))
    );
    const { pageState, appState } = store.getState();
    if (!pageState.isSitemap) {
      // Check is there a cookie lang code
      if (req.cookies.langCode) {
        // Check cookie lang code and default lang code are same
        if (appState.selectedLangCode == req.cookies.langCode) {
          CookieSSRUtil.deleteLangId(req, res);
          UrlSSRUtil.move(
            res,
            UrlUtil.replaceLanguageCode({
              url: appState.url,
              withBase: true,
            })
          );
          return false;
        } else {
          // Find cookie lang code
          const langKeys = req.cookies.langCode?.split('-') || ['', ''];
          const foundCookieLanguagesWithKey = appState.languages.findMulti(
            'shortKey',
            langKeys[0]
          );
          const foundCookieLanguageWithLocale =
            foundCookieLanguagesWithKey.findSingle('locale', langKeys[1]);
          // Check lang code is correct
          if (foundCookieLanguageWithLocale) {
            store.dispatch(
              setSelectedLangCodeState(req.cookies.langCode ?? '')
            );
            store.dispatch(
              setSelectedLangIdState(foundCookieLanguageWithLocale._id)
            );
            if (req.cookies.langId != foundCookieLanguageWithLocale._id) {
              CookieSSRUtil.setLangId(store, req, res);
            }
          } else {
            UrlSSRUtil.move(
              res,
              UrlUtil.replaceLanguageCode({
                url: appState.url,
                withBase: true,
              })
            );
            return false;
          }
        }
      } else {
        // Check there is a cookie lang id and check it is same with default lang id
        if (
          req.cookies.langId &&
          req.cookies.langId != appState.selectedLangId
        ) {
          const foundCookieLanguageWithId = appState.languages.findSingle(
            '_id',
            req.cookies.langId
          );
          if (foundCookieLanguageWithId) {
            UrlSSRUtil.move(
              res,
              UrlUtil.replaceLanguageCode({
                url: appState.url,
                newLanguage: foundCookieLanguageWithId,
                withBase: true,
              })
            );
            return false;
          }
        }
      }
    }
  } else {
    res.writeHead(
      409,
      "Default language couldn't find. Please add a default language"
    );
    res.end();
    return false;
  }

  return true;
};

export const LanguageSSRUtil = {
  init: init,
};
