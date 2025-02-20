import React from 'react';
import { StatusId } from '@constants/status';
import { UserService } from '@services/user.service';
import { PermissionId } from '@constants/permissions';
import { IUserGetResultService } from 'types/services/user.service';
import { IComponentGetResultService } from 'types/services/component.service';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { HelperUtil } from '@utils/helper.util';
import ComponentAuthor from '@components/elements/author';

type IComponentProps = {
  component: IComponentGetResultService<{ authors?: IUserGetResultService[] }>;
};

const ComponentThemeAuthors: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

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
            {props.component.customData?.authors?.map(
              (author, index) =>
                author && (
                  <ComponentAuthor
                    key={`author-${author._id}`}
                    item={author}
                    index={index}
                  />
                )
            )}
          </div>
        </div>
      </section>
    );
  });

ComponentThemeAuthors.componentServerSideProps = async (
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

export default ComponentThemeAuthors;
