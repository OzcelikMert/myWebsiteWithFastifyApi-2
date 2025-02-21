import React from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { DateMask } from '@library/variable/date';
import { IPostGetPrevNextResultService } from 'types/services/post.service';

type IComponentProps = {
  item: IPostGetPrevNextResultService;
};

const ComponentPageBlogNextBlog = React.memo((props: IComponentProps) => {
  const appState = useAppSelector((state) => state.appState);

  const blogUrl = UrlUtil.createHref({
    url: appState.url,
    targetPath: EndPoints.BLOG_WITH.URL(props.item.contents?.url),
  });
  const date = new Date(props.item.updatedAt ?? '');

  return (
    <article className="next-blog" title={props.item.contents?.title}>
      <div className="card">
        <div className="card-body d-flex flex-row justify-content-end">
          <div className="align-content-center me-3">
            <a href={blogUrl} className="fw-bold fs-4">
              <span>{props.item.contents?.title}</span>
            </a>
            <div className="date">
              <time dateTime={date.getStringWithMask(DateMask.DATE)}>
                <span>{date.toDateString()}</span>
              </time>
            </div>
          </div>
          <div className="image hover-top">
            <a href={blogUrl} className="img-link">
              <Image
                src={ImageSourceUtil.getUploadedImageSrc(
                  props.item.contents?.image
                )}
                alt={props.item.contents?.title ?? ''}
                className="img-fluid rounded-4"
                width={150}
                height={150}
              />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
});

export default ComponentPageBlogNextBlog;
