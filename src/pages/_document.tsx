import React, { Component } from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { LanguageUtil } from '@utils/language.util';
import { useAppSelector } from '@lib/hooks';

export default function HTMLDocument({props}: any) {
  //console.log("_document", props);

  return (
    <Html lang={'en_US'}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
