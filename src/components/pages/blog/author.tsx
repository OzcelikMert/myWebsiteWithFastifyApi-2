import React from 'react';
import { IUserPopulateService } from 'types/services/user.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { DateMask } from '@library/variable/date';

type IComponentProps = {
  item: IUserPopulateService;
  index: number;
  date: string;
};

const ComponentPageBlogAuthor = React.memo((props: IComponentProps) => {
  const appState = useAppSelector((state) => state.appState);
  const t = useAppSelector(selectTranslation);

  const date = new Date(props.date);
  const authorURL = UrlUtil.createHref({
    url: appState.url,
    targetPath: EndPoints.BLOGS_WITH.AUTHOR(props.item.url),
  });

  return (
    <div className="author mt-2">
      <div className="row">
        <div className="col-8 d-flex flex-row align-items-center">
          <div className="avatar d-inline-block me-3">
            <a href={authorURL} className="hover-top">
              <Image
                src={ImageSourceUtil.getUploadedImageSrc(props.item.image)}
                alt={props.item.name}
                className="img-fluid"
                width={40}
                height={40}
              />
            </a>
          </div>
          <div className="d-inline-block">
            <div className="author">
              {t('by')}{' '}
              <a href={authorURL}>
                <span>{props.item.name}</span>
              </a>
            </div>
            <div className="date">
              <time dateTime={date.getStringWithMask(DateMask.DATE)}>
                <span>{date.toDateString()}</span>
              </time>
            </div>
          </div>
        </div>
        <div className="col-4 text-end fs-4">
          <a className="me-2" href={props.item.facebook || '#'}>
            <span>
              <i className="mdi mdi-facebook"></i>
            </span>
          </a>
          <a className="me-2" href={props.item.instagram || '#'}>
            <span>
              <i className="mdi mdi-instagram"></i>
            </span>
          </a>
          <a href={props.item.twitter || '#'}>
            <span>
              <i className="mdi mdi-twitter"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageBlogAuthor;
