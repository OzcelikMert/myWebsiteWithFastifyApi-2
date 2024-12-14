import React, { Component } from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IPostTermPopulateService } from 'types/services/postTerm.service';
import { IUserPopulateService } from 'types/services/user.service';
import { IPostGetManyResultService } from 'types/services/post.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { DateMask } from '@library/variable/date';
import { useAppSelector } from '@lib/hooks';
import { translation } from '@lib/features/translationSlice';
import { useSelector } from 'react-redux';

type IComponentProps = {
  item: IPostGetManyResultService;
  hideAuthorImage?: boolean;
  hideShortContent?: boolean;
  hideCategories?: boolean;
  index?: number;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
  imageAuthorHeight?: number;
  imageAuthorWidth?: number;
};

export default function ComponentBlog({
  item,
  className,
  hideAuthorImage,
  hideCategories,
  hideShortContent,
  imageAuthorHeight,
  imageAuthorWidth,
  imageHeight,
  imageWidth,
  index,
}: IComponentProps) {
  let url = useAppSelector((state) => state.appState.url);
  let t = useSelector(translation);

  const Authors = (props: IUserPopulateService[], createdAt: string) => {
    const date = new Date(createdAt);
    return (
      <div className="meta">
        <div className="meta-avatars">
          {hideAuthorImage
            ? null
            : props.map((author) => (
                <a
                  key={author._id}
                  href={UrlUtil.createHref({
                    url: url,
                    targetPath: EndPoints.BLOGS_WITH.AUTHOR(author.url),
                  })}
                  className="hover-top"
                >
                  <Image
                    src={ImageSourceUtil.getUploadedImageSrc(author.image)}
                    alt={author.name}
                    className="img-fluid"
                    width={imageAuthorWidth ?? 40}
                    height={imageAuthorHeight ?? 40}
                  />
                </a>
              ))}
        </div>
        <div className="meta-contents">
          <div className="meta-authors">
            {t('by')}{' '}
            {props.map((author, index) => (
              <span key={author._id}>
                <a
                  href={UrlUtil.createHref({
                    url: url,
                    targetPath: EndPoints.BLOGS_WITH.AUTHOR(author.url),
                  })}
                >
                  <span>{author.name}</span>
                </a>
                {index < props.length - 1 ? ' & ' : ''}
              </span>
            ))}
          </div>
          <div className="meta-date">
            <time dateTime={date.getStringWithMask(DateMask.DATE)}>
              <span>{date.toDateString()}</span>
            </time>
          </div>
        </div>
      </div>
    );
  };

  const Category = (props: IPostTermPopulateService, index: number) => {
    const categoryURL = UrlUtil.createHref({
      url: url,
      targetPath: EndPoints.BLOGS_WITH.CATEGORY(props.contents.url),
    });
    return (
      <a key={props._id} href={categoryURL} className="btn btn-light">
        {' '}
        <span>{props.contents.title}</span>
      </a>
    );
  };

  const blogURL = UrlUtil.createHref({
    url: url,
    targetPath: EndPoints.BLOG(item.contents?.url),
  });

  return (
    <article key={item._id} className={className} title={item.contents?.title}>
      <div className="card">
        <div className="card-header hover-top">
          <a href={blogURL} className="img-link">
            <Image
              src={ImageSourceUtil.getUploadedImageSrc(item.contents?.image)}
              alt={item.contents?.title ?? ''}
              className="img-fluid"
              width={imageWidth ?? 500}
              height={imageHeight ?? 250}
            />
          </a>
        </div>
        <div className="card-body">
          {hideCategories ? null : (
            <div className="blog-category-badges">
              {item.categories?.map((category, index) =>
                Category(category, index)
              )}
            </div>
          )}
          <a href={blogURL} className="card-title">
            <span>{item.contents?.title}</span>
          </a>
          {hideShortContent ? null : (
            <p className="card-text">{item.contents?.shortContent}</p>
          )}
        </div>
        <div className="card-footer">
          {Authors(
            [item.authorId, ...(item.authors ?? [])],
            item.createdAt ?? ''
          )}
        </div>
      </div>
    </article>
  );
}
