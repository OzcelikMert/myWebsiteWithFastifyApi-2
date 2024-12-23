import React, { Component } from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { LanguageUtil } from '@utils/language.util';
import { useAppSelector } from '@lib/hooks';
import { IRootState } from '@lib/store';

export default function HTMLDocument({ ...props }: any) {
  let langCode = 'en_US';
  const initialState = props.__NEXT_DATA__.props.initialState as IRootState;

  if (initialState) {
    const appState = initialState.appState;
    const language = appState.languages.findSingle(
      '_id',
      appState.selectedLangId
    );
    if (language) {
      langCode = LanguageUtil.getCode(language, '_', true);
    }
  }

  return (
    <Html lang={langCode}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
