import React from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IUserPopulateService } from 'types/services/user.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  item: IUserPopulateService;
  index: number;
  authorImageWidth?: number;
  authorImageHeight?: number;
};

const ComponentBlogAuthorImage = React.memo((props: IComponentProps) => {
  const url = useAppSelector((state) => state.appState.url);

  return (
    <a
      href={UrlUtil.createHref({
        url: url,
        targetPath: EndPoints.BLOGS_WITH.AUTHOR(props.item.url),
      })}
      className="hover-top"
    >
      <Image
        src={ImageSourceUtil.getUploadedImageSrc(props.item.image)}
        alt={props.item.name}
        className="img-fluid"
        width={props.authorImageWidth ?? 40}
        height={props.authorImageHeight ?? 40}
      />
    </a>
  );
});

export default ComponentBlogAuthorImage;
