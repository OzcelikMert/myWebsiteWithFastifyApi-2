import React from 'react';
import { IUserPopulateService } from 'types/services/user.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  item: IUserPopulateService;
  index: number;
  isLast: boolean;
};

const ComponentBlogAuthor = React.memo((props: IComponentProps) => {
  const url = useAppSelector((state) => state.appState.url);

  return (
    <span>
      <a
        href={UrlUtil.createHref({
          url: url,
          targetPath: EndPoints.BLOGS_WITH.AUTHOR(props.item.url),
        })}
      >
        <span>{props.item.name}</span>
      </a>
      {!props.isLast ? ' & ' : ''}
    </span>
  );
});

export default ComponentBlogAuthor;
