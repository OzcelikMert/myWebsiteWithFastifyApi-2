import React, { JSX } from 'react';
import ProviderNoFound from '@components/providers/noFound';
import ComponentHead from '@components/head';
import ComponentThemeSubscribe from '@components/theme/subscribe';
import { ComponentKey } from '@constants/componentKeys';
import ComponentThemeFooter from '@components/theme/footer';
import ComponentThemeNavbar from '@components/theme/navbar';
import ComponentThemeHeader from '@components/theme/header';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {
  children: React.ReactNode;
  pageTitle?: string;
  headerBgImage?: string;
  headerContent?: string;
  headerButtons?: JSX.Element;
};

export default function ComponentAppLayout({
  children,
  pageTitle,
  headerBgImage,
  headerContent,
  headerButtons,
}: IComponentProps) {
  const pageState = useAppSelector((state) => state.pageState);

  const subscribeComponent = pageState.publicComponents?.findSingle(
    'key',
    ComponentKey.Subscribe
  );
  const footerComponent = pageState.publicComponents?.findSingle(
    'key',
    ComponentKey.Footer
  );
  const navbarComponent = pageState.publicComponents?.findSingle(
    'key',
    ComponentKey.Navbar
  );
  const videoHeaderComponent = pageState.publicComponents?.findSingle(
    'key',
    ComponentKey.Header
  );

  return (
    <div>
      <ComponentHead key={'componentHead'} title={pageTitle} />
      {navbarComponent ? (
        <ComponentThemeNavbar component={navbarComponent} />
      ) : null}
      <div className="container-fluid main-section" id="main-section">
        <div className="page-content">
          {videoHeaderComponent ? (
            <ComponentThemeHeader
              component={videoHeaderComponent}
              title={pageTitle}
              backgroundImage={headerBgImage}
              content={headerContent}
              buttons={headerButtons}
            />
          ) : null}
          <ProviderNoFound>{children}</ProviderNoFound>
        </div>
        {subscribeComponent ? (
          <ComponentThemeSubscribe component={subscribeComponent} />
        ) : null}
        {footerComponent ? (
          <ComponentThemeFooter component={footerComponent} />
        ) : null}
      </div>
    </div>
  );
}
