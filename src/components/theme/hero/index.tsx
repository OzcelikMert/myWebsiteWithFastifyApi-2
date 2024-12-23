import React from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { TypeAnimation } from 'react-type-animation';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService;
};

export default function ComponentThemeHero({ component }: IComponentProps) {
  const componentElementContents =
    HelperUtil.getComponentElementContents(component);

  return (
    <section className="hero-section" id="hero-section">
      <AnimationOnScroll
        animateIn="animate__fadeInRight"
        animateOnce={true}
        animatePreScroll={false}
      >
        <div className="container">
          <div className="row d-flex">
            <div className="col-lg-8 order-lg-2">
              <div className="position-relative img-container">
                <Image
                  src={ImageSourceUtil.getUploadedImageSrc(
                    componentElementContents('image')?.content
                  )}
                  alt={componentElementContents('title1')?.content ?? ''}
                  className="img-fluid"
                  height={500}
                  width={500}
                />
              </div>
            </div>
            <div className="col-lg-4 pe-lg-5 m-auto">
              <div className="type">
                <h1 className="font" id="feature-text">
                  <TypeAnimation
                    sequence={[
                      componentElementContents('title1')?.content ?? '',
                      2500,
                      componentElementContents('title2')?.content ?? '',
                      2500,
                      componentElementContents('title3')?.content ?? '',
                      2500,
                      componentElementContents('title4')?.content ?? '',
                      2500,
                    ]}
                    wrapper="span"
                    repeat={Infinity}
                    cursor={false}
                    speed={1}
                    deletionSpeed={5}
                    preRenderFirstString={true}
                  />
                </h1>
              </div>
              <p className="lead">
                {componentElementContents('describe')?.content}
              </p>
              <a
                href="#hot-blogs"
                className="btn btn-primary btn-lg w-100 mt-3"
              >
                <span>{componentElementContents('buttonText')?.content}</span>
              </a>
            </div>
          </div>
        </div>
      </AnimationOnScroll>
    </section>
  );
}
