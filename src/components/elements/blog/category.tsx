import React from 'react';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';
import { IPostTermPopulateService } from 'types/services/postTerm.service';

type IComponentProps = {
  item: IPostTermPopulateService;
  index: number;
};

const ComponentBlogCategory = React.memo((props: IComponentProps) => {
  const url = useAppSelector((state) => state.appState.url);

  const categoryURL = UrlUtil.createHref({
    url: url,
    targetPath: EndPoints.BLOGS_WITH.CATEGORY(props.item.contents.url),
  });

  return (
    <a href={categoryURL} className="btn btn-light">
      {' '}
      <span>{props.item.contents.title}</span>
    </a>
  );
});

export default ComponentBlogCategory;
