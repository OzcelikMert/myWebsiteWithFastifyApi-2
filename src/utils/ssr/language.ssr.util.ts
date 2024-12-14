import { LanguageService } from '@services/language.service';
import { StatusId } from '@constants/status';
import { LanguageUtil } from '@utils/language.util';
import { CookieSSRUtil } from '@utils/ssr/cookie.ssr.util';
import { UrlUtil } from '@utils/url.util';
import { IncomingMessage, ServerResponse } from 'http';
import { UrlSSRUtil } from '@utils/ssr/url.ssr.util';
import { IAppStore } from '@lib/store';
import { setDefaultLangIdState, setSelectedLangCodeState, setSelectedLangIdState } from '@lib/features/appSlice';

const init = async (
  store: IAppStore,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const {pageState, appState} = store.getState();
  // Get all languages
  const languages =
    (await LanguageService.getMany({ statusId: StatusId.Active })).data ?? [];

  // Find default language
  const foundDefaultLanguage = languages.findSingle(
    'isDefault',
    true
  );
  if (foundDefaultLanguage) {
    store.dispatch(setDefaultLangIdState(foundDefaultLanguage._id));
    store.dispatch(setSelectedLangIdState(foundDefaultLanguage._id));
    store.dispatch(setSelectedLangCodeState(LanguageUtil.getCode(foundDefaultLanguage)));

    if (!pageState.isSitemap) {
      // Check is there a cookie lang code
      if (appState.cookies.langCode) {
        // Check cookie lang code and default lang code are same
        if (appState.selectedLangCode == appState.cookies.langCode) {
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
          const langKeys = appState.cookies.langCode?.split('-') || ["", ""];
          const foundCookieLanguagesWithKey = appState.languages.findMulti(
            'shortKey',
            langKeys[0]
          );
          const foundCookieLanguageWithLocale =
            foundCookieLanguagesWithKey.findSingle('locale', langKeys[1]);
          // Check lang code is correct
          if (foundCookieLanguageWithLocale) {
            appState.selectedLangId = foundCookieLanguageWithLocale._id;
            appState.selectedLangCode = appState.cookies.langCode ?? "";
            if (appState.cookies.langId != appState.selectedLangId) {
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
          appState.cookies.langId &&
          appState.cookies.langId != appState.selectedLangId
        ) {
          const foundCookieLanguageWithId = appState.languages.findSingle(
            '_id',
            appState.cookies.langId
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
