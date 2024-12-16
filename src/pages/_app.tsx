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
import { Provider } from 'react-redux';

function App({ Component, ...rest }: AppContext) {
  //console.log(rest);
  const { store, props } = wrapper.useWrappedStore(rest);
  console.log("*******App*******", store.getState());
  
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  );
}

App.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (props) => {
    const req = props.ctx.req;
    const res = props.ctx.res;

    if (typeof window === 'undefined' && req && res) {
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

      const {appState} = store.getState();

      const serviceResultSettings = await SettingService.get({
        langId: appState.selectedLangId,
      });

      if (serviceResultSettings.status && serviceResultSettings.data) {
        store.dispatch(setSettingsState(serviceResultSettings.data));
      }

      //console.log("app serverSideProps", store.getState());
      

      return {
        pageProps: {}
      }
    }

    return {
      pageProps: {}
    };
  }
);

export default wrapper.withRedux(App);
