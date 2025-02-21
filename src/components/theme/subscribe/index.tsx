import React, { useEffect, useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import ComponentLoadingButton from '@components/elements/button/withLoading';
import { SubscriberService } from '@services/subscriber.service';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { VariableLibrary } from '@library/variable';
import { HelperUtil } from '@utils/helper.util';
import { useFormReducer } from '@library/react/handles/form';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubscriberSchema } from 'schemas/subscriber.schema';
import ComponentThemeSubscribeForm from './form';
import ComponentThemeSubscribeSuccessMessage from './successMessage';

type IComponentState = {
  isSubscribed: boolean;
};

const initialState: IComponentState = {
  isSubscribed: false,
};

type IComponentFormState = {
  email: string;
};

const initialFormState = {
  email: '',
};

type IComponentProps = {
  component: IComponentGetResultService;
};

const ComponentThemeSubscribe: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const abortControllerRef = React.useRef(new AbortController());

    const [isSubscribed, setIsSubscribed] = useState(initialState.isSubscribed);

    const form = useForm<IComponentFormState>({
      defaultValues: initialFormState,
      resolver: zodResolver(SubscriberSchema.post),
    });

    const onSubmit = async (data: IComponentFormState) => {
      const params = data;

      const serviceResult = await SubscriberService.add(
        {
          email: params.email,
        },
        abortControllerRef.current.signal
      );

      setIsSubscribed(serviceResult.status);
    };

    const formValues = form.getValues();

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    return (
      <section className="subscribe-section">
        <div className="container">
          <div
            className="content"
            style={{
              backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(componentElementContents('bgImage')?.content)})`,
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
                                componentElementContents('image1')?.content
                              )}
                              alt={
                                componentElementContents('title')?.content ?? ''
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
                                componentElementContents('image2')?.content
                              )}
                              alt={
                                componentElementContents('title')?.content ?? ''
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
                                componentElementContents('image3')?.content
                              )}
                              alt={
                                componentElementContents('title')?.content ?? ''
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
                                componentElementContents('image4')?.content
                              )}
                              alt={
                                componentElementContents('title')?.content ?? ''
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
                        {componentElementContents('title')?.content}
                      </h1>
                    </AnimationOnScroll>
                    <AnimationOnScroll
                      animateIn="animate__fadeInDown"
                      delay={200}
                      animateOnce={true}
                      animatePreScroll={false}
                    >
                      <p className="card-text text-light pe-md-5">
                        {componentElementContents('describe')?.content}
                      </p>
                    </AnimationOnScroll>
                    <AnimationOnScroll
                      animateIn="animate__fadeInUp"
                      delay={400}
                      animateOnce={true}
                      animatePreScroll={false}
                    >
                      {isSubscribed ? (
                        <ComponentThemeSubscribeSuccessMessage
                          text={
                            componentElementContents(
                              'subscribeSuccessMessageWithVariable'
                            )?.content?.replace(
                              '{{subscriberEmail}}',
                              formValues.email
                            ) ?? ''
                          }
                        />
                      ) : (
                        <ComponentThemeSubscribeForm
                          form={form}
                          onSubmit={(data) => onSubmit(data)}
                          submitButtonText={
                            componentElementContents('buttonText')?.content ??
                            ''
                          }
                          mutedText={
                            componentElementContents(
                              'weWillNeverShareYourEmail'
                            )?.content ?? ''
                          }
                        />
                      )}
                    </AnimationOnScroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  });

export default ComponentThemeSubscribe;
