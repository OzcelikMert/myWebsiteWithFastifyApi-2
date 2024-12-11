import type { AppContext, AppProps } from 'next/app';
import React from 'react';

import '@styles/global.scss';

import '@library/variable/array';
import '@library/variable/string';
import '@library/variable/number';
import '@library/variable/date';
import '@library/variable/math';

import ComponentApp from '@components/app';
import { PageSSRUtil } from '@utils/page.ssr.util';
import { SettingService } from '@services/setting.service';
import { LanguageSSRUtil } from '@utils/language.ssr.util';
import { UrlSSRUtil } from '@utils/url.ssr.util';
import { wrapper } from '@lib/store';
import StoreProvider from '@components/providers/storeProvider';

function App(props: AppProps) {
  const { pageProps, Component, router } = props;
  return (
    <StoreProvider pageProps={pageProps}>
      <ComponentApp {...pageProps} Component={Component} router={router} />
    </StoreProvider>
  );
}

App.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (props: AppContext) => {
    if (typeof window === 'undefined' && props.ctx.req && props.ctx.res) {
      const req = props.ctx.req;
      const res = props.ctx.res;

      req.pageData = {};
      req.appData = {};
      req.getURL = UrlSSRUtil.get(req);
      console.log(req.getURL);

      req.pageData.isSitemap =
        req.getURL.asPath.includes('/sitemap.xml') ||
        req.getURL.asPath.includes('/sitemaps/');

      if (!req.pageData.isSitemap) {
        await PageSSRUtil.initPublicComponents(req);
      }

      const isLangInit = await LanguageSSRUtil.init(req, res);
      if (!isLangInit) {
        return {
          pageProps: {}
        };
      }

      const serviceResultSettings = await SettingService.get({
        langId: req.appData.selectedLangId,
      });

      if (serviceResultSettings.status && serviceResultSettings.data) {
        req.appData.settings = serviceResultSettings.data;
      }

      return {
        pageProps: PageSSRUtil.getProps(req),
      };
    }

    return {
      pageProps: {}
    };
  }
);

export default wrapper.withRedux(App);
