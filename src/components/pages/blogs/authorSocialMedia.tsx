import React from 'react';
import { IUserGetResultService } from 'types/services/user.service';

type IComponentProps = {
  item: IUserGetResultService;
};

const ComponentPageBlogsAuthorSocialMedia = React.memo(
  (props: IComponentProps) => {
    return (
      <div>
        <a className="me-4 fs-3 text-light" href={props.item.facebook || '#'}>
          <span>
            <i className="mdi mdi-facebook"></i>
          </span>
        </a>
        <a className="me-4 fs-3 text-light" href={props.item.instagram || '#'}>
          <span>
            <i className="mdi mdi-instagram"></i>
          </span>
        </a>
        <a className="fs-3 text-light" href={props.item.twitter || '#'}>
          <span>
            <i className="mdi mdi-twitter"></i>
          </span>
        </a>
      </div>
    );
  }
);

export default ComponentPageBlogsAuthorSocialMedia;
