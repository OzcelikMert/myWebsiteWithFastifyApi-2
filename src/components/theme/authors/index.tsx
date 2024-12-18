import React from 'react';
import { StatusId } from '@constants/status';
import { UserService } from '@services/user.service';
import { PermissionId } from '@constants/permissions';
import { IUserGetResultService } from 'types/services/user.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IComponentGetResultService } from 'types/services/component.service';
import { IFuncComponentServerSideProps } from 'types/components/ssr';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService<{ authors?: IUserGetResultService[] }>;
};

function ComponentThemeAuthors({ component }: IComponentProps) {
  let componentElementContents =
    HelperUtil.getComponentElementContents(component);

  const Author = (item: IUserGetResultService, index: number) => {
    return (
      <div key={`author_${item._id}`} className="card-wrapper">
        <div className="card">
          <div className="card-image">
            <Image
              className="img-fluid"
              src={ImageSourceUtil.getUploadedImageSrc(item.image)}
              alt={item.name}
              fill
            />
          </div>
          <ul className="social-icons">
            <li>
              <a href={item.facebook ?? '#'}>
                <i className="mdi mdi-facebook"></i>
              </a>
            </li>
            <li>
              <a href={item.instagram ?? '#'}>
                <i className="mdi mdi-instagram"></i>
              </a>
            </li>
            <li>
              <a href={item.twitter ?? '#'}>
                <i className="mdi mdi-twitter"></i>
              </a>
            </li>
            <li>
              <a href={item.email ? `mailto:${item.email}` : '#'}>
                <i className="mdi mdi-email"></i>
              </a>
            </li>
          </ul>

          <div className="details">
            <h2>
              {item.name}
              <br />
              <span className="job-title">{item.comment}</span>
            </h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="authors-section">
      <div className="container">
        <h2 className="section-header animate__animated animate__fadeInDown animate__fast">
          {componentElementContents('title')?.content}
        </h2>
        <p className="section-content animate__animated animate__fadeInDown animate__delay-1s">
          {componentElementContents('describe')?.content}
        </p>
        <div className="container d-flex flex-wrap justify-content-center">
          {component.customData?.authors?.map((author, index) =>
            Author(author, index)
          )}
        </div>
      </div>
    </section>
  );
}

const componentServerSideProps: IFuncComponentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  component.customData.authors = (
    await UserService.getMany({
      statusId: StatusId.Active,
      permissions: [PermissionId.BlogAdd, PermissionId.BlogEdit],
    })
  ).data;
};

ComponentThemeAuthors.componentServerSideProps = componentServerSideProps;

export default ComponentThemeAuthors;
