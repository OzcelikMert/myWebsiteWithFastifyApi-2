import React from 'react';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import {
  IPostGetManyResultService,
  IPostGetOneResultService,
  IPostGetPrevNextResultService,
} from 'types/services/post.service';
import HTMLReactParser from 'html-react-parser';
import ComponentAppLayout from '@components/app/layout';
import { IPostTermPopulateService } from 'types/services/postTerm.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { IUserPopulateService } from 'types/services/user.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { DateMask } from '@library/variable/date';
import ComponentBlog from '@components/elements/blog';
import { useAppSelector } from '@lib/hooks';
import { wrapper } from '@lib/store';
import { setPageState, setQueriesState } from '@lib/features/pageSlice';
import { selectTranslation } from '@lib/features/translationSlice';
import { VariableLibrary } from '@library/variable';

type IPageQueries = {
  blog: IPostGetOneResultService | null;
  prevBlog: IPostGetPrevNextResultService | null;
  nextBlog: IPostGetPrevNextResultService | null;
  blogsMightLike: IPostGetManyResultService[] | null;
  url: string;
};

export default function PageBlogURL() {
  const appState = useAppSelector((state) => state.appState);
  const queries = useAppSelector(
    (state) => state.pageState.queries as IPageQueries
  );
  const t = useAppSelector(selectTranslation);

  const blog = queries.blog;
  const prevBlog = queries.prevBlog;
  const nextBlog = queries.nextBlog;

  const onClickShare = async () => {
    navigator.share({
      title: typeof window != 'undefined' ? window.document.title : "",
      text: blog?.contents?.shortContent,
      url: typeof window != 'undefined' ? window.location.href : ""
    });
  }

  const HeaderBottom = () => {
    return (
      <div className='align-center fs-5'>
        <span className='text-light mt-1 mx-4'>
          {queries.blog?.views || 1}{' '}
          <i className="text-primary mdi mdi-eye fs-4"></i>
        </span>
        <span className='text-light mt-1 mx-4' role="button" onClick={() => onClickShare()}>
          <i className="text-warning mdi mdi-share-variant fs-4"></i>
        </span>
      </div>
    );
  }

  const Author = (props: IUserPopulateService, index: number) => {
    const date = new Date(blog?.createdAt ?? '');
    const authorURL = UrlUtil.createHref({
      url: appState.url,
      targetPath: EndPoints.BLOGS_WITH.AUTHOR(props.url),
    });

    return (
      <div className="author mt-2">
        <div className="row">
          <div className="col-8 d-flex flex-row align-items-center">
            <div className="avatar d-inline-block me-3">
              <a href={authorURL} className="hover-top">
                <Image
                  src={ImageSourceUtil.getUploadedImageSrc(props.image)}
                  alt={props.name}
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
                  <span>{props.name}</span>
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
            <a className="me-2" href={props.facebook || '#'}>
              <span>
                <i className="mdi mdi-facebook"></i>
              </span>
            </a>
            <a className="me-2" href={props.instagram || '#'}>
              <span>
                <i className="mdi mdi-instagram"></i>
              </span>
            </a>
            <a href={props.twitter || '#'}>
              <span>
                <i className="mdi mdi-twitter"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const Category = (props: IPostTermPopulateService, index: number) => {
    const categoryURL = UrlUtil.createHref({
      url: appState.url,
      targetPath: EndPoints.BLOGS_WITH.CATEGORY(props.contents.url),
    });

    return (
      <a href={categoryURL} className="btn btn-light">
        {' '}
        <span>{props.contents.title}</span>
      </a>
    );
  };

  const Blog = () => {
    return (
      <article title={blog?.contents?.title}>
        <div className="content">
          {blog?.contents?.content
            ? HTMLReactParser(blog?.contents?.content || '')
            : null}
        </div>
        <div className="content-bottom mt-5">
          <div className="categories pb-3 border-bottom">
            <h6 className="fw-bold">{t('categories')}</h6>
            <div className="blog-category-badges">
              {blog?.categories?.map((category, index) =>
                Category(category, index)
              )}
            </div>
          </div>
          <div className="authors mt-3">
            <h6 className="fw-bold">{'authors'}</h6>
            {blog
              ? [blog.authorId, ...(blog.authors ?? [])].map((author, index) =>
                  Author(author, index)
                )
              : null}
          </div>
        </div>
      </article>
    );
  };

  const PrevBlog = () => {
    const prevBlogURL = UrlUtil.createHref({
      url: appState.url,
      targetPath: EndPoints.BLOG_WITH.URL(prevBlog?.contents?.url),
    });
    const date = new Date(prevBlog?.createdAt ?? '');
    return (
      <article className="prev-blog" title={prevBlog?.contents?.title}>
        <div className="card">
          <div className="card-body d-flex flex-row">
            <div className="image hover-top">
              <a href={prevBlogURL} className="img-link">
                <Image
                  src={ImageSourceUtil.getUploadedImageSrc(
                    prevBlog?.contents?.image
                  )}
                  alt={prevBlog?.contents?.title ?? ''}
                  className="img-fluid rounded-4"
                  width={150}
                  height={150}
                />
              </a>
            </div>
            <div className="ms-3 align-content-center">
              <a href={prevBlogURL} className="fw-bold fs-4">
                <span>{prevBlog?.contents?.title}</span>
              </a>
              <div className="date">
                <time dateTime={date.getStringWithMask(DateMask.DATE)}>
                  <span>{date.toDateString()}</span>
                </time>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const NextBlog = () => {
    const nextBlogURL = UrlUtil.createHref({
      url: appState.url,
      targetPath: EndPoints.BLOG_WITH.URL(nextBlog?.contents?.url),
    });
    const date = new Date(nextBlog?.createdAt ?? '');
    return (
      <article className="next-blog" title={nextBlog?.contents?.title}>
        <div className="card">
          <div className="card-body d-flex flex-row justify-content-end">
            <div className="align-content-center me-3">
              <a href={nextBlogURL} className="fw-bold fs-4">
                <span>{nextBlog?.contents?.title}</span>
              </a>
              <div className="date">
                <time dateTime={date.getStringWithMask(DateMask.DATE)}>
                  <span>{date.toDateString()}</span>
                </time>
              </div>
            </div>
            <div className="image hover-top">
              <a href={nextBlogURL} className="img-link">
                <Image
                  src={ImageSourceUtil.getUploadedImageSrc(
                    nextBlog?.contents?.image
                  )}
                  alt={nextBlog?.contents?.title ?? ''}
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
  };

  return (
    <ComponentAppLayout
      pageTitle={`${t('blog')} - ${blog?.contents?.title || queries.url}`}
      headerBgImage={blog?.contents?.image}
      headerContent={blog?.contents?.shortContent}
      headerButtons={HeaderBottom()}
    >
      <div className="page page-blog">
        <section className="blog-section">
          <div className="container">
            {
              blog ? <Blog /> : null
            }
            <div className="prev-next mt-5 blogs">
              <div className="title border-bottom">
                <h6 className="d-inline-block w-50">{t('previous')}</h6>
                <h6 className="d-inline-block w-50 text-end">{t('next')}</h6>
              </div>
              <div className="row">
                <div className="col-md-6 text-start">
                  {prevBlog ? <PrevBlog /> : null}
                </div>
                <div className="col-md-6 text-end">
                  {nextBlog ? <NextBlog /> : null}
                </div>
              </div>
            </div>
            <div className="blogs mt-5">
              <div className="title border-bottom">
                <h6>{t('blogsYouMightLike')}</h6>
              </div>
              <div className="row">
                {queries.blogsMightLike?.map((item, index) => (
                  <ComponentBlog
                    className={`col-md-4 mt-4`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ComponentAppLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const req = context.req;
    const res = context.res;

    const { appState } = store.getState();

    let queries: IPageQueries = {
      blog: null,
      blogsMightLike: null,
      nextBlog: null,
      prevBlog: null,
      url: '',
    };

    const url = decodeURI((context.query?.url as string) || '');
    queries.url = url;

    if(!VariableLibrary.isEmpty(url)){
      const serviceResultBlog = await PostService.getWithURL({
        typeId: PostTypeId.Blog,
        url: url,
        langId: appState.selectedLangId,
        statusId: StatusId.Active,
      });
      
      if (serviceResultBlog.status && serviceResultBlog.data) {
        const blog = serviceResultBlog.data;
  
        await PostService.updateViewWithId({
          _id: blog._id,
          typeId: blog.typeId,
          langId: appState.selectedLangId,
          url: url,
        });
  
        queries.blog = blog;
  
        const serviceResultBlogPrevNext = await PostService.getPrevNextWithId({
          _id: blog._id,
          typeId: blog.typeId,
          langId: appState.selectedLangId,
          statusId: StatusId.Active,
        });
  
        if (serviceResultBlogPrevNext.status && serviceResultBlogPrevNext.data) {
          queries.prevBlog = serviceResultBlogPrevNext.data.prev || null;
          queries.nextBlog = serviceResultBlogPrevNext.data.next || null;
        }
  
        const serviceResultBlogsMightLike = await PostService.getMany({
          typeId: [blog.typeId],
          categories: blog.categories?.map((category) => category._id),
          langId: appState.selectedLangId,
          statusId: StatusId.Active,
          count: 3,
          ignorePostId: [
            blog._id,
            ...(serviceResultBlogPrevNext.data?.next
              ? [serviceResultBlogPrevNext.data.next._id]
              : []),
            ...(serviceResultBlogPrevNext.data?.prev
              ? [serviceResultBlogPrevNext.data.prev._id]
              : []),
          ],
        });
  
        if (
          serviceResultBlogsMightLike.status &&
          serviceResultBlogsMightLike.data
        ) {
          queries.blogsMightLike = serviceResultBlogsMightLike.data;
        }

        store.dispatch(setQueriesState(queries));
        store.dispatch(setPageState(blog));
      } 
    }

    return {
      props: {},
    };
  }
);
