import React from 'react';
import Head from 'next/head';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { LanguageUtil } from '@utils/language.util';
import { UrlUtil } from '@utils/url.util';
import HTMLReactParser from 'html-react-parser';
import { useAppSelector } from '@redux/hooks';
import { IPostAlternateService } from 'types/services/post.service';

const Alternate = React.memo((props: IPostAlternateService) => {
  const appState = useAppSelector((state) => state.appState);

  const language = appState.languages.findSingle('_id', props.langId);
  if (language) {
    const langCode = LanguageUtil.getCode(language);
    return (
      <link
        rel={`alternate_${langCode}`}
        hrefLang={langCode}
        href={UrlUtil.replaceLanguageCode({
          url: appState.url,
          newLanguage: language,
          withBase: true,
        })}
      />
    );
  } else {
    return null;
  }
});

const FacebookAlternate = React.memo((props: IPostAlternateService) => {
  const appState = useAppSelector((state) => state.appState);

  const language = appState.languages.findSingle('_id', props.langId);
  if (language) {
    const langCode = LanguageUtil.getCode(language, '_', true);
    return <meta property="og:locale:alternate" content={langCode} />;
  } else {
    return null;
  }
});

type IComponentProps = {
  title?: string;
};

const ComponentHead = React.memo((props: IComponentProps) => {
  const appState = useAppSelector((state) => state.appState);
  const page = useAppSelector((state) => state.pageState.page);

  const getTitle = () => {
    const defaultTitle = appState.settings.seoContents?.title;
    if (props.title) {
      props.title = `${defaultTitle} | ${props.title}`;
    } else if (page) {
      props.title = `${defaultTitle} | ${page.contents?.title}`;
    }
    return props.title;
  };

  const getKeywords = () => {
    let keywords: string[] = [];

    if (page && page.tags && page.tags.length > 0) {
      keywords = page.tags
        .map((tag) => tag?.contents?.title)
        .filter((tag) => tag) as string[];
    } else if (
      appState.settings.seoContents?.tags &&
      appState.settings.seoContents.tags.length > 0
    ) {
      keywords = appState.settings.seoContents.tags;
    }

    return keywords.join(',');
  };

  const pageTitle = getTitle();
  const desc =
    page?.contents?.shortContent ||
    appState.settings.seoContents?.content ||
    '';
  const logo = ImageSourceUtil.getUploadedImageSrc(appState.settings.logo);
  const language = appState.languages.findSingle(
    '_id',
    appState.selectedLangId
  );

  return (
    <Head key="html_head">
      <title key="meta_title">{pageTitle}</title>
      <link
        key="link_shortcut_icon"
        rel="shortcut icon"
        href={ImageSourceUtil.getUploadedImageSrc(appState.settings.icon)}
      />
      <link key="link_canonical" rel="canonical" href={appState.url.full} />
      <meta
        key="viewport"
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />
      {page?.isNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : null}
      <meta key="description" name="description" content={desc} />
      <meta
        key="copyright"
        name="copyright"
        content={appState.settings.seoContents?.title}
      />
      <meta key="author" name="author" content="Özçelik Software" />
      <meta key="keywords" name="keywords" content={getKeywords()} />
      {page?.alternates?.map((item) => (
        <Alternate key={`alternate-${item.langId}`} {...item} />
      ))}

      <meta key="name" itemProp="name" content={pageTitle} />
      <meta key="description" itemProp="description" content={desc} />
      <meta key="image" itemProp="image" content={logo} />

      <meta key={`og_type`} property="og:type" content="website" />
      <meta key={`og_title`} property="og:title" content={pageTitle} />
      <meta key={`og_url`} property="og:url" content={appState.url.full} />
      <meta key={`og_description`} property="og:description" content={desc} />
      <meta key={`og_site_name`} property="og:site_name" content={pageTitle} />
      <meta key={`og_image`} property="og:image" content={logo} />
      <meta
        key={`og_locale`}
        property="og:locale"
        content={language ? LanguageUtil.getCode(language, '_', true) : ''}
      />
      {page?.alternates?.map((item) => (
        <FacebookAlternate
          key={`facebook-alternate-${item.langId}`}
          {...item}
        />
      ))}
      <meta
        key={`twitter_card_card`}
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        key={`twitter_card_title`}
        name="twitter:title"
        content={pageTitle}
      />
      <meta
        key={`twitter_card_url`}
        name="twitter:url"
        content={appState.url.full}
      />
      <meta
        key={`twitter_card_description`}
        name="twitter:description"
        content={desc}
      />
      <meta key={`twitter_card_image`} name="twitter:image" content={logo} />
      {appState.settings.head ? HTMLReactParser(appState.settings.head) : null}
      {appState.settings.script
        ? HTMLReactParser(appState.settings.script)
        : null}
    </Head>
  );
});

export default ComponentHead;
