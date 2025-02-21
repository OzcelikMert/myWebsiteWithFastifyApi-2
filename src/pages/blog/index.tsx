import React from 'react';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import {
  IPostGetManyResultService,
  IPostGetResultService,
  IPostGetPrevNextResultService,
} from 'types/services/post.service';
import HTMLReactParser from 'html-react-parser';
import ComponentAppLayout from '@components/app/layout';
import ComponentBlog from '@components/elements/blog';
import { useAppSelector } from '@redux/hooks';
import { wrapper } from '@redux/store';
import { setPageState, setQueriesState } from '@redux/features/pageSlice';
import { selectTranslation } from '@redux/features/translationSlice';
import { VariableLibrary } from '@library/variable';
import ComponentPageBlogAuthor from '@components/pages/blog/author';
import ComponentPageBlogCategory from '@components/pages/blog/category';
import ComponentPageBlogPrevBlog from '@components/pages/blog/prevBlog';
import ComponentPageBlogNextBlog from '@components/pages/blog/nextBlog';
import ComponentPageBlogHeaderButtons from '@components/pages/blog/headerButtons';

type IPageQueries = {
  blog: IPostGetResultService | null;
  prevBlog: IPostGetPrevNextResultService | null;
  nextBlog: IPostGetPrevNextResultService | null;
  blogsMightLike: IPostGetManyResultService[] | null;
  url: string;
};

export default function PageBlogURL() {
  const queries = useAppSelector(
    (state) => state.pageState.queries as IPageQueries
  );
  const t = useAppSelector(selectTranslation);

  const blog = queries.blog;
  const prevBlog = queries.prevBlog;
  const nextBlog = queries.nextBlog;

  const onClickShare = async () => {
    navigator.share({
      title: typeof window != 'undefined' ? window.document.title : '',
      text: blog?.contents?.shortContent,
      url: typeof window != 'undefined' ? window.location.href : '',
    });
  };

  const title = blog?.contents?.title || '404';

  return (
    <ComponentAppLayout
      pageTitle={`${t('blog')} - ${title}`}
      headerBgImage={blog?.contents?.image}
      headerContent={blog?.contents?.shortContent}
      headerButtons={
        blog ? (
          <ComponentPageBlogHeaderButtons
            views={blog?.views ?? 1}
            onClickShare={() => onClickShare()}
          />
        ) : undefined
      }
    >
      <div className="page page-blog">
        <section className="blog-section">
          <div className="container">
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
                    {blog?.categories?.map((category, index) => (
                      <ComponentPageBlogCategory
                        key={`blog-category-${category._id}`}
                        item={category}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
                <div className="authors mt-3">
                  <h6 className="fw-bold">{'authors'}</h6>
                  {[blog?.author, ...(blog?.authors ?? [])].map(
                    (author, index) =>
                      author && (
                        <ComponentPageBlogAuthor
                          key={`blog-author-${author._id}`}
                          item={author}
                          index={index}
                          date={blog?.updatedAt ?? ''}
                        />
                      )
                  )}
                </div>
              </div>
            </article>
            <div className="prev-next mt-5 blogs">
              <div className="title border-bottom">
                <h6 className="d-inline-block w-50">{t('previous')}</h6>
                <h6 className="d-inline-block w-50 text-end">{t('next')}</h6>
              </div>
              <div className="row">
                <div className="col-md-6 text-start">
                  {prevBlog ? (
                    <ComponentPageBlogPrevBlog item={prevBlog} />
                  ) : null}
                </div>
                <div className="col-md-6 text-end">
                  {nextBlog ? (
                    <ComponentPageBlogNextBlog item={nextBlog} />
                  ) : null}
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

    const queries: IPageQueries = {
      blog: null,
      blogsMightLike: null,
      nextBlog: null,
      prevBlog: null,
      url: '',
    };

    const url = decodeURI((context.query?.url as string) || '');
    queries.url = url;

    if (!VariableLibrary.isEmpty(url)) {
      const serviceResultBlog = await PostService.getWithURL(
        {
          typeId: PostTypeId.Blog,
          url: url,
          langId: appState.selectedLangId,
          statusId: StatusId.Active,
        },
        req.abortController.signal
      );

      if (serviceResultBlog.status && serviceResultBlog.data) {
        const blog = serviceResultBlog.data;

        await PostService.updateViewWithId(
          {
            _id: blog._id,
            typeId: blog.typeId,
            langId: appState.selectedLangId,
            url: url,
          },
          req.abortController.signal
        );

        queries.blog = blog;

        const serviceResultBlogPrevNext = await PostService.getPrevNextWithId(
          {
            _id: blog._id,
            typeId: blog.typeId,
            langId: appState.selectedLangId,
            statusId: StatusId.Active,
          },
          req.abortController.signal
        );

        if (
          serviceResultBlogPrevNext.status &&
          serviceResultBlogPrevNext.data
        ) {
          queries.prevBlog = serviceResultBlogPrevNext.data.prev || null;
          queries.nextBlog = serviceResultBlogPrevNext.data.next || null;
        }

        const serviceResultBlogsMightLike = await PostService.getMany(
          {
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
          },
          req.abortController.signal
        );

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
