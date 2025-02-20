import React from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IPostGetManyResultService } from 'types/services/post.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { DateMask } from '@library/variable/date';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentBlogAuthorImage from './authorImage';
import ComponentBlogAuthor from './author';
import ComponentBlogCategory from './category';

type IComponentProps = {
  item: IPostGetManyResultService;
  index?: number;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
  authorImageHeight?: number;
  authorImageWidth?: number;
  hideAuthorImage?: boolean;
  hideShortContent?: boolean;
  hideCategories?: boolean;
};

const ComponentBlog = React.memo((props: IComponentProps) => {
  const url = useAppSelector((state) => state.appState.url);
  const t = useAppSelector(selectTranslation);

  const blogURL = UrlUtil.createHref({
    url: url,
    targetPath: EndPoints.BLOG_WITH.URL(props.item.contents?.url),
  });
  const date = new Date(props.item.createdAt ?? '');
  const authors =
    props.item.authors?.filter((item) => typeof item !== 'undefined') ?? [];
  const categories =
    props.item.categories?.filter((item) => typeof item !== 'undefined') ?? [];

  return (
    <article
      key={props.item._id}
      className={props.className}
      title={props.item.contents?.title}
    >
      <div className="card">
        <div className="card-header hover-top">
          <a href={blogURL} className="img-link">
            <Image
              src={ImageSourceUtil.getUploadedImageSrc(
                props.item.contents?.image
              )}
              alt={props.item.contents?.title ?? ''}
              className="img-fluid"
              width={props.imageWidth ?? 500}
              height={props.imageHeight ?? 250}
            />
          </a>
        </div>
        <div className="card-body">
          {props.hideCategories ? null : (
            <div className="blog-category-badges">
              {categories.map((category, index) => (
                <ComponentBlogCategory
                  key={`blog-category-${category._id}`}
                  item={category}
                  index={index}
                />
              ))}
            </div>
          )}
          <a href={blogURL} className="card-title">
            <span>{props.item.contents?.title}</span>
          </a>
          {props.hideShortContent ? null : (
            <p className="card-text">{props.item.contents?.shortContent}</p>
          )}
        </div>
        <div className="card-footer">
          <div className="meta">
            <div className="meta-avatars">
              {props.hideAuthorImage
                ? null
                : authors.map((author, index) => (
                    <ComponentBlogAuthorImage
                      key={`blog-author-${author._id}-image`}
                      item={author}
                      index={index}
                      authorImageHeight={props.authorImageHeight}
                      authorImageWidth={props.authorImageWidth}
                    />
                  ))}
            </div>
            <div className="meta-contents">
              <div className="meta-authors">
                {t('by')}{' '}
                {authors.map((author, index) => (
                  <ComponentBlogAuthor
                    key={`blog-author-${author._id}`}
                    item={author}
                    index={index}
                    isLast={authors.length >= index + 1}
                  />
                ))}
              </div>
              <div className="meta-date">
                <time dateTime={date.getStringWithMask(DateMask.DATE)}>
                  <span>{date.toDateString()}</span>
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

export default ComponentBlog;
