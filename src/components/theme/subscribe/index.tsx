import React, { useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import ComponentLoadingButton from '@components/elements/button/loadingButton';
import { SubscriberService } from '@services/subscriber.service';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { VariableLibrary } from '@library/variable';
import { HelperUtil } from '@utils/helper.util';

type IComponentState = {
  isSubscribed: boolean;
  email: string;
};

type IComponentProps = {
  component: IComponentGetResultService;
};

export default function ComponentThemeSubscribe({
  component,
}: IComponentProps) {
  const [isSubscribed, setIsSubscribed] = useState<IComponentState["isSubscribed"]>(false);
  const [email, setEmail] = useState<IComponentState["email"]>('');

  const onClickSubscribe = async () => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (VariableLibrary.isEmpty(email) || !email.match(isValidEmail)) {
      return null;
    }

    const serviceResult = await SubscriberService.add({
      email: email,
    });

    setIsSubscribed(true);
  };

  const SubscribeSuccessMessage = () => {
    return (
      <div className="subscribe-success mt-3">
        <h5 className="animate__animated animate__fadeInUp">
          {HelperUtil.getComponentElementContents(
            component,
            'subscribeSuccessMessageWithVariable'
          )?.content?.replace('{{subscriberEmail}}', email)}
        </h5>
      </div>
    );
  };

  const Subscribe = () => {
    return (
      <AnimationOnScroll
        animateIn="animate__fadeInUp"
        delay={400}
        animateOnce={true}
        animatePreScroll={false}
      >
        <div className="subscribe row mt-3 text-center justify-content-center">
          <div className="col-md-10">
            <input
              type="email"
              className="form-control"
              placeholder="email@email.com"
              value={email}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="form-text text-light">
              {
                HelperUtil.getComponentElementContents(
                  component,
                  'weWillNeverShareYourEmail'
                )?.content
              }
            </div>
          </div>
          <div className="col-md-8 mt-2">
            <ComponentLoadingButton
              text={
                HelperUtil.getComponentElementContents(component, 'buttonText')
                  ?.content
              }
              className="btn btn-warning"
              onClick={() => onClickSubscribe()}
            />
          </div>
        </div>
      </AnimationOnScroll>
    );
  };

  return (
    <section className="subscribe-section">
      <div className="container">
        <div
          className="content"
          style={{
            backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(HelperUtil.getComponentElementContents(component, 'bgImage')?.content)})`,
          }}
        >
          <div className="subscribe-mask"></div>
          <div className="card main-card">
            <div className="card-body">
              <div className="row d-flex">
                <div className="col-md-5 order-lg-2">
                  <div className="row">
                    <div className="col-6 d-flex align-items-center ps-1">
                      <div className="row justify-content-end">
                        <AnimationOnScroll
                          animateIn="animate__fadeInTopLeft"
                          animateOnce={true}
                          className="col-12 mb-3"
                          animatePreScroll={false}
                        >
                          <Image
                            className="img-fluid"
                            src={ImageSourceUtil.getUploadedImageSrc(
                              HelperUtil.getComponentElementContents(
                                component,
                                'image1'
                              )?.content
                            )}
                            alt={
                              HelperUtil.getComponentElementContents(
                                component,
                                'title'
                              )?.content ?? ''
                            }
                            width={250}
                            height={250}
                          />
                        </AnimationOnScroll>
                        <AnimationOnScroll
                          animateIn="animate__fadeInBottomLeft"
                          animateOnce={true}
                          delay={200}
                          className="col-11 mb-3"
                          animatePreScroll={false}
                        >
                          <Image
                            className="img-fluid"
                            src={ImageSourceUtil.getUploadedImageSrc(
                              HelperUtil.getComponentElementContents(
                                component,
                                'image2'
                              )?.content
                            )}
                            alt={
                              HelperUtil.getComponentElementContents(
                                component,
                                'title'
                              )?.content ?? ''
                            }
                            width={250}
                            height={250}
                          />
                        </AnimationOnScroll>
                      </div>
                    </div>
                    <div className="col-6 d-flex align-items-center ps-1">
                      <div className="row">
                        <AnimationOnScroll
                          animateIn="animate__fadeInTopRight"
                          animateOnce={true}
                          delay={100}
                          className="col-10 mb-3"
                          animatePreScroll={false}
                        >
                          <Image
                            className="img-fluid"
                            src={ImageSourceUtil.getUploadedImageSrc(
                              HelperUtil.getComponentElementContents(
                                component,
                                'image3'
                              )?.content
                            )}
                            alt={
                              HelperUtil.getComponentElementContents(
                                component,
                                'title'
                              )?.content ?? ''
                            }
                            width={250}
                            height={250}
                          />
                        </AnimationOnScroll>
                        <AnimationOnScroll
                          animateIn="animate__fadeInBottomRight"
                          delay={300}
                          animateOnce={true}
                          className="col-11 mb-3"
                          animatePreScroll={false}
                        >
                          <Image
                            className="img-fluid"
                            src={ImageSourceUtil.getUploadedImageSrc(
                              HelperUtil.getComponentElementContents(
                                component,
                                'image4'
                              )?.content
                            )}
                            alt={
                              HelperUtil.getComponentElementContents(
                                component,
                                'title'
                              )?.content ?? ''
                            }
                            width={250}
                            height={250}
                          />
                        </AnimationOnScroll>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7 mt-4 mt-md-0 d-flex flex-column align-items-center align-items-md-start justify-content-center pe-md-5 mb-3 mb-md-0 text-center text-md-start">
                  <AnimationOnScroll
                    animateIn="animate__fadeInDown"
                    animateOnce={true}
                    animatePreScroll={false}
                  >
                    <h1 className="card-title text-light">
                      {
                        HelperUtil.getComponentElementContents(
                          component,
                          'title'
                        )?.content
                      }
                    </h1>
                  </AnimationOnScroll>
                  <AnimationOnScroll
                    animateIn="animate__fadeInDown"
                    delay={200}
                    animateOnce={true}
                    animatePreScroll={false}
                  >
                    <p className="card-text text-light pe-md-5">
                      {
                        HelperUtil.getComponentElementContents(
                          component,
                          'describe'
                        )?.content
                      }
                    </p>
                  </AnimationOnScroll>
                  {isSubscribed ? <SubscribeSuccessMessage /> : <Subscribe />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
