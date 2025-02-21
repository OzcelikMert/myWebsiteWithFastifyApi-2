import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { IPostTermPopulateService } from 'types/services/postTerm.service';

type IComponentProps = {
  item: IPostTermPopulateService;
  index: number;
};

const ComponentPageBlogCategory = React.memo((props: IComponentProps) => {
  const appState = useAppSelector((state) => state.appState);

  const categoryURL = UrlUtil.createHref({
    url: appState.url,
    targetPath: EndPoints.BLOGS_WITH.CATEGORY(props.item.contents.url),
  });

  return (
    <a href={categoryURL} className="btn btn-light">
      {' '}
      <span>{props.item.contents.title}</span>
    </a>
  );
});

export default ComponentPageBlogCategory;
