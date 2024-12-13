import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { PageTypeId } from '@constants/pageTypes';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@lib/hooks';
import { HelperUtil } from '@utils/helper.util';
import { IAppState } from '@lib/features/appSlice';
import { IPageState } from '@lib/features/pageSlice';

type IComponentProps = {
  component: IComponentGetResultService;
  title?: string;
  content?: string;
  buttons?: JSX.Element;
  backgroundImage?: string;
};

export default function ComponentThemeHeader({
  component,
  title,
  backgroundImage,
  buttons,
  content,
}: IComponentProps) {
  const { pageState, appState } = useAppSelector((state) => state);

  const isHomePage = pageState.page?.pageTypeId == PageTypeId.Home;
  const bgImage = backgroundImage || pageState.page?.contents?.image;

  return (
    <section
      className={`header-section container-fluid ${isHomePage ? 'home' : ''}`}
      id="header"
    >
      {bgImage ? (
        <BackgroundImage backgroundImage={bgImage} />
      ) : (
        <BackgroundVideo component={component} />
      )}
      <div className="mask"></div>
      {isHomePage ? (
        <HomePageContent appState={appState} component={component} />
      ) : (
        <PageContent
          buttons={buttons}
          content={content}
          pageState={pageState}
          title={title}
        />
      )}
    </section>
  );
}

function HomePageContent({
  appState,
  component,
}: {
  appState: IAppState;
  component: IComponentProps['component'];
}) {
  return (
    <div className="content">
      <h2 className="animate__animated animate__fadeInDown animate__fast">
        {appState.settings.seoContents?.title}
      </h2>
      <p className="animate__animated animate__fadeInDown animate__delay-1s">
        {HelperUtil.getComponentElementContents(component, 'content')?.content}
      </p>
      <div className="buttons mt-3 animate__animated animate__fadeInDown animate__delay-2s">
        <a href="#hero-section" className="btn btn-primary btn-lg">
          <span>
            {
              HelperUtil.getComponentElementContents(component, 'buttonText')
                ?.content
            }
          </span>
        </a>
      </div>
    </div>
  );
}

function PageContent({
  pageState,
  title,
  content,
  buttons,
}: {
  pageState: IPageState;
  title: IComponentProps['title'];
  content: IComponentProps['content'];
  buttons: IComponentProps['buttons'];
}) {
  return (
    <div className="content">
      <h2 className="animate__animated animate__fadeInDown animate__fast">
        {title || pageState.page?.contents?.title}
      </h2>
      {content ? (
        <p className="animate__animated animate__fadeInDown animate__delay-1s">
          {content}
        </p>
      ) : null}
      {buttons ? (
        <div className="buttons mt-3 animate__animated animate__fadeInDown animate__delay-2s">
          {buttons}
        </div>
      ) : null}
    </div>
  );
}

function BackgroundVideo({
  component,
}: {
  component: IComponentProps['component'];
}) {
  return (
    <div className="video-wrap">
      <video
        className="video-bg"
        autoPlay
        playsInline
        loop
        muted
        preload="none"
        title="Water"
      >
        <source
          src={
            HelperUtil.getComponentElementContents(component, 'videoURL')
              ?.content
          }
          type="video/mp4"
        />
        <source
          src={
            HelperUtil.getComponentElementContents(component, 'videoURL')
              ?.content
          }
          type="video/mp4"
        />
      </video>
    </div>
  );
}

function BackgroundImage({
  backgroundImage,
}: {
  backgroundImage: IComponentProps['backgroundImage'];
}) {
  return (
    <div
      className="image-bg"
      style={{
        backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(backgroundImage)})`,
      }}
    ></div>
  );
}
