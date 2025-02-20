import React, { JSX } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { PageTypeId } from '@constants/pageTypes';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { HelperUtil } from '@utils/helper.util';
import { IComponentWithServerSideProps } from 'types/components/ssr';

type IComponentProps = {
  component: IComponentGetResultService;
  title?: string;
  content?: string;
  buttons?: JSX.Element;
  backgroundImage?: string;
};

const ComponentThemeHeader: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const appState = useAppSelector((state) => state.appState);
    const pageState = useAppSelector((state) => state.pageState);

    const isHomePage = pageState.page?.pageTypeId == PageTypeId.Home;
    const bgImage = props.backgroundImage || pageState.page?.contents?.image;

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    let animateDelay = 0;

    return (
      <section
        className={`header-section container-fluid ${isHomePage ? 'home' : ''}`}
        id="header"
      >
        {bgImage ? (
          <div
            className="image-bg"
            style={{
              backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(bgImage)})`,
            }}
          ></div>
        ) : (
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
                src={componentElementContents('videoURL')?.content}
                type="video/mp4"
              />
              <source
                src={componentElementContents('videoURL')?.content}
                type="video/mp4"
              />
            </video>
          </div>
        )}
        <div className="mask"></div>
        {isHomePage ? (
          <div className="content">
            <h2 className="animate__animated animate__fadeInDown animate__fast">
              {appState.settings.seoContents?.title}
            </h2>
            <p className="animate__animated animate__fadeInDown animate__delay-1s">
              {componentElementContents('content')?.content}
            </p>
            <div className="buttons mt-3 animate__animated animate__fadeInDown animate__delay-2s">
              <a href="#hero-section" className="btn btn-primary btn-lg">
                <span>{componentElementContents('buttonText')?.content}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="content">
            <h2 className="animate__animated animate__fadeInDown animate__fast">
              {props.title || pageState.page?.contents?.title}
            </h2>
            {props.content
              ? ++animateDelay && (
                  <p
                    className={`animate__animated animate__fadeInDown animate__delay-${animateDelay}s`}
                  >
                    {props.content}
                  </p>
                )
              : null}
            {props.buttons
              ? ++animateDelay && (
                  <div
                    className={`buttons mt-3 animate__animated animate__fadeInDown animate__delay-${animateDelay}s`}
                  >
                    {props.buttons}
                  </div>
                )
              : null}
          </div>
        )}
      </section>
    );
  });

export default ComponentThemeHeader;
