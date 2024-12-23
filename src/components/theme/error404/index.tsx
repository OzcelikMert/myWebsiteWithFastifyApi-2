import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService;
};

export default function ComponentThemeError404({ component }: IComponentProps) {
  const componentElementContents =
    HelperUtil.getComponentElementContents(component);

  return (
    <div>
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <i className="bi bi-exclamation-triangle triangle-color display-1"></i>
              <h1 className="display-1 font">404</h1>
              <h1 className="mb-4 font">
                {componentElementContents('title')?.content}
              </h1>
              <p className="mb-4 desc">
                {componentElementContents('describe')?.content}
              </p>
              <a className="btn btn-outline-primary btn-lg" href="/">
                <span>{componentElementContents('buttonText')?.content}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
