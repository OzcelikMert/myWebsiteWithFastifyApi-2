import React, { Component } from 'react';
import Head from 'next/head';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { LanguageUtil } from '@utils/language.util';
import { UrlUtil } from '@utils/url.util';
import HTMLReactParser from 'html-react-parser';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {
  title: string;
};

export default function ComponentHead({ title }: IComponentProps) {
  const { appState, pageState } = useAppSelector((state) => state);

  const getTitle = () => {
    let defaultTitle = appState.settings.seoContents?.title;
    if (title) {
      title = `${defaultTitle} | ${title}`;
    } else if (pageState.page) {
      title = `${defaultTitle} | ${pageState.page.contents?.title}`;
    }
    return title;
  }
  
  const getKeywords = () => {
    let keywords: string[] = [];
  
    if (pageState.page && pageState.page.tags && pageState.page.tags.length > 0) {
      keywords = pageState.page.tags
        .map((tag) => tag?.contents?.title)
        .filter((tag) => tag) as string[];
    } else if (
      appState.settings.seoContents?.tags &&
      appState.settings.seoContents.tags.length > 0
    ) {
      keywords = appState.settings.seoContents.tags;
    }
  
    return keywords.join(',');
  }
  
  const getAlternates = () => {
    return pageState.page?.alternates?.map((alternate) => {
      const language = appState.languages.findSingle('_id', alternate.langId);
      if (language) {
        return (
          <link
            rel="alternate"
            hrefLang={LanguageUtil.getCode(language)}
            href={UrlUtil.replaceLanguageCode({
              url: appState.url,
              newLanguage: language,
              withBase: true,
            })}
          />
        );
      }
    });
  }
  
  const getFacebookAlternates = () => {
    return pageState.page?.alternates?.map((alternate) => {
      const language = appState.languages.findSingle('_id', alternate.langId);
      if (language) {
        return (
          <meta
            property="og:locale:alternate"
            content={LanguageUtil.getCode(language, '_', true)}
          />
        );
      }
    });
  }

  const pageTitle = getTitle();
  const desc =
    pageState.page?.contents?.shortContent ||
    appState.settings.seoContents?.content ||
    '';
  const logo = ImageSourceUtil.getUploadedImageSrc(appState.settings.logo);
  const language = appState.languages.findSingle(
    '_id',
    appState.selectedLangId
  );

  return (
    <Head>
      <title>{pageTitle}</title>
      <link
        rel="shortcut icon"
        href={ImageSourceUtil.getUploadedImageSrc(appState.settings.icon)}
      />
      <link rel="canonical" href={appState.url.full} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {pageState.page?.isNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : null}
      <meta name="description" content={desc} />
      <meta name="copyright" content={appState.settings.seoContents?.title} />
      <meta name="author" content="Özçelik Software" />
      <meta name="keywords" content={getKeywords()} />
      {getAlternates()}

      <meta itemProp="name" content={pageTitle} />
      <meta itemProp="description" content={desc} />
      <meta itemProp="image" content={logo} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:url" content={appState.url.full} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content={pageTitle} />
      <meta property="og:image" content={logo} />
      <meta
        property="og:locale"
        content={language ? LanguageUtil.getCode(language, '_', true) : ''}
      />
      {getFacebookAlternates()}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:url" content={appState.url.full} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={logo} />
      {appState.settings.head ? HTMLReactParser(appState.settings.head) : null}
      {appState.settings.script
        ? HTMLReactParser(appState.settings.script)
        : null}
    </Head>
  );
}