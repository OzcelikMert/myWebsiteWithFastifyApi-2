import type { AppContext, AppProps } from 'next/app';
import React from 'react';

import '@styles/global.scss';

import '@library/variable/array';
import '@library/variable/string';
import '@library/variable/number';
import '@library/variable/date';
import '@library/variable/math';

import { PageSSRUtil } from '@utils/ssr/page.ssr.util';
import { SettingService } from '@services/setting.service';
import { LanguageSSRUtil } from '@utils/ssr/language.ssr.util';
import { UrlSSRUtil } from '@utils/ssr/url.ssr.util';
import { wrapper } from '@lib/store';
import StoreProvider from '@components/providers/storeProvider';
import { setSettingsState, setURLState } from '@lib/features/appSlice';
import { setIsSitemapState } from '@lib/features/pageSlice';

function App(props: AppProps) {
  const { pageProps, Component, router } = props;
  return (
    <StoreProvider {...pageProps} router={router}>
      <Component />
    </StoreProvider>
  );
}

App.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (props: AppContext) => {
    if (typeof window === 'undefined' && props.ctx.req && props.ctx.res) {
      const req = props.ctx.req;
      const res = props.ctx.res;

      const {appState, pageState} = store.getState();

      const url = UrlSSRUtil.get(req);
      store.dispatch(setURLState(url));
      console.log(url);

      const isSitemap =
        url.asPath.includes('/sitemap.xml') ||
        url.asPath.includes('/sitemaps/');
      
      store.dispatch(setIsSitemapState(isSitemap));

      if (!isSitemap) {
        await PageSSRUtil.initPublicComponents(store, req);
      }

      const isLangInit = await LanguageSSRUtil.init(store, req, res);
      if (!isLangInit) {
        return {
          pageProps: {}
        };
      }

      const serviceResultSettings = await SettingService.get({
        langId: appState.selectedLangId,
      });

      if (serviceResultSettings.status && serviceResultSettings.data) {
        store.dispatch(setSettingsState(serviceResultSettings.data));
      }
    }

    return {
      pageProps: {}
    };
  }
);

export default wrapper.withRedux(App);
