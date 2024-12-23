import React from 'react';
import { SocialMediaKey } from '@constants/socialMediaKeys';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import ComponentFeatureIcon from '@components/elements/feature/icon';
import { HelperUtil } from '@utils/helper.util';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {
  component: IComponentGetResultService;
};

export default function ComponentThemeFeatures({ component }: IComponentProps) {
  const socialMedia = useAppSelector(
    (state) => state.appState.settings.socialMedia ?? []
  );

  const componentElementContents =
    HelperUtil.getComponentElementContents(component);

  const socialMediaURL = HelperUtil.getSocialMediaURL(socialMedia);

  const Icons = () => {
    return (
      <div className="row">
        <div className="col-md-6">
          <ComponentFeatureIcon
            title={componentElementContents('feature1Title')?.content ?? ''}
            describe={
              componentElementContents('feature1Describe')?.content ?? ''
            }
            icon={componentElementContents('feature1Icon')?.content ?? ''}
            color="blue"
          />
        </div>
        <div className="col-md-6">
          <ComponentFeatureIcon
            title={componentElementContents('feature2Title')?.content ?? ''}
            describe={
              componentElementContents('feature2Describe')?.content ?? ''
            }
            icon={componentElementContents('feature2Icon')?.content ?? ''}
            color="red"
          />
        </div>
        <div className="col-md-6">
          <ComponentFeatureIcon
            title={componentElementContents('feature3Title')?.content ?? ''}
            describe={
              componentElementContents('feature3Describe')?.content ?? ''
            }
            icon={componentElementContents('feature3Icon')?.content ?? ''}
            color="orange"
          />
        </div>
        <div className="col-md-6">
          <ComponentFeatureIcon
            title={componentElementContents('feature4Title')?.content ?? ''}
            describe={
              componentElementContents('feature4Describe')?.content ?? ''
            }
            icon={componentElementContents('feature4Icon')?.content ?? ''}
            color="green"
          />
        </div>
      </div>
    );
  };

  const Content = () => {
    return (
      <div className="align-items-start">
        <h1 className="fw-bold">
          {componentElementContents('title')?.content}
        </h1>
        <p className="fs-6 opacity-75">
          {componentElementContents('describe')?.content}
        </p>
        <a href="#" className="btn btn-primary btn-lg mt-3">
          <span>{componentElementContents('buttonText')?.content}</span>
        </a>
      </div>
    );
  };

  const Socials = () => {
    return (
      <div className="icons mt-auto pt-3">
        <div className="icon-title">
          <h5>{componentElementContents('socialTitle')?.content}</h5>
        </div>
        <a href={socialMediaURL(SocialMediaKey.Facebook)}>
          <i className="mdi mdi-facebook p-2"></i>
        </a>
        <a href={socialMediaURL(SocialMediaKey.Twitter)}>
          <i className="mdi mdi-twitter p-2"></i>
        </a>
        <a href={socialMediaURL(SocialMediaKey.Instagram)}>
          <i className="mdi mdi-instagram p-2"></i>
        </a>
      </div>
    );
  };

  return (
    <section className="property-section">
      <div className="container">
        <div className="row">
          <AnimationOnScroll
            animateIn="animate__fadeInLeft"
            animateOnce={true}
            className="col-lg-7 text-center cards"
            animatePreScroll={false}
          >
            <Icons />
          </AnimationOnScroll>
          <AnimationOnScroll
            animateIn="animate__fadeInRight"
            animateOnce={true}
            className="col-lg-5 content ps-lg-5 mt-3 mt-lg-0 d-flex flex-column text-center"
            animatePreScroll={false}
          >
            <Content />
            <Socials />
          </AnimationOnScroll>
        </div>
      </div>
    </section>
  );
}
