import React, { useState } from 'react';
import { PageSSRUtil } from '@utils/ssr/page.ssr.util';
import { PageTypeId } from '@constants/pageTypes';
import ComponentAppLayout from '@components/app/layout';
import { PostTermService } from '@services/postTerm.service';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { PostService } from '@services/post.service';
import { IPostGetManyResultService } from 'types/services/post.service';
import ComponentBlog from '@components/elements/blog';
import ComponentLoadingButton from '@components/elements/button/loadingButton';
import { UserService } from '@services/user.service';
import { IUserGetResultService } from 'types/services/user.service';
import { EndPoints } from '@constants/endPoints';
import { wrapper } from '@lib/store';
import { useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { setQueriesState } from '@lib/features/pageSlice';
import ComponentSearchButton from '@components/elements/button/searchButton';
import { UrlUtil } from '@utils/url.util';

const perPageBlogCount = 9;

type IComponentState = {
  blogs: IPostGetManyResultService[];
  isActiveShowMoreButton: boolean;
  pageNumber: number;
};

type IPageQueries = {
  blogs?: IPostGetManyResultService[];
  maxBlogCount: number;
  category: IPostTermGetResultService | null;
  author: IUserGetResultService | null;
  params: {
    search?: string;
    page: number;
    category?: string;
    author?: string;
  };
};

export default function PageBlogs() {
  const queries = useAppSelector(
    (state) => state.pageState.queries as IPageQueries
  );

  const [pageNumber, setPageNumber] = useState<IComponentState['pageNumber']>(
    queries.params.page || 1
  );
  const [blogs, setBlogs] = useState<IComponentState['blogs']>(
    queries.blogs ?? []
  );
  const [isActiveShowMoreButton, setIsActiveShowMoreButton] = useState<
    IComponentState['isActiveShowMoreButton']
  >(queries.maxBlogCount > blogs.length);

  const page = useAppSelector((state) => state.pageState.page);
  const appState = useAppSelector((state) => state.appState);

  const t = useAppSelector(selectTranslation);

  const MemoizedComponentBlog = React.memo(ComponentBlog);

  const getPageTitle = () => {
    let title: string = '';
    if (queries.category) {
      title = `${t('category')} - ${queries.category.contents!.title}`;
    } else if (queries.author) {
      title = `${t('author')} - ${queries.author.name}`;
    } else if (queries.params.search) {
      title = `${t('search')} - ${queries.params.search}`;
    }

    if (queries.params.page > 1) {
      title = `${title.length > 0 ? '- ' : ''}${queries.params.page}`;
    }

    return `${page?.contents?.title} ${title.length > 0 ? `- ${title}` : ''}`;
  };

  const onSearch = (searchText: string) => {
    window.location.href = UrlUtil.createHref({
      url: appState.url,
      targetPath: EndPoints.BLOGS_WITH.SEARCH(searchText),
    });
  };

  const onClickShowMore = async () => {
    if (isActiveShowMoreButton) return false;
    const newPageNumber = pageNumber + 1;
    const serviceResult = await PostService.getMany({
      langId: appState.selectedLangId,
      typeId: [PostTypeId.Blog],
      statusId: StatusId.Active,
      count: perPageBlogCount,
      page: pageNumber,
      ...(queries.category ? { categories: [queries.category._id] } : {}),
      ...(queries.params.search ? { title: queries.params.search } : {}),
    });
    if (serviceResult.status && serviceResult.data) {
      setPageNumber(newPageNumber);
      const newBlogs = [...blogs, ...(serviceResult.data ?? [])];
      setBlogs(newBlogs);
      setIsActiveShowMoreButton(queries.maxBlogCount > newBlogs.length);
    }
  };

  const AuthorSocialMedia = () => {
    const author = queries.author;
    return (
      <div>
        <a className="me-4 fs-3 text-light" href={author?.facebook || '#'}>
          <span>
            <i className="mdi mdi-facebook"></i>
          </span>
        </a>
        <a className="me-4 fs-3 text-light" href={author?.instagram || '#'}>
          <span>
            <i className="mdi mdi-instagram"></i>
          </span>
        </a>
        <a className="fs-3 text-light" href={author?.twitter || '#'}>
          <span>
            <i className="mdi mdi-twitter"></i>
          </span>
        </a>
      </div>
    );
  };

  const HeaderButtom = () => {
    return (
      <div className="align-center">
        {queries.author ? <AuthorSocialMedia /> : undefined}
        <div className="mt-2">
          <ComponentSearchButton
            placeHolder={t('search')}
            onSearch={(searchText) => onSearch(searchText)}
          />
        </div>
      </div>
    );
  };

  return (
    <ComponentAppLayout
      pageTitle={getPageTitle()}
      headerBgImage={queries.category?.contents?.image || queries.author?.image}
      headerContent={
        queries.category?.contents?.shortContent || queries.author?.comment
      }
      headerButtons={<HeaderButtom />}
    >
      <div className="page page-blogs">
        <section className="page-blogs">
          <div className="container">
            <div className="blogs">
              <h5 className="animate__animated animate__fadeInLeft animate__fast">
                {t('blogFoundMessageWithVariable').replace(
                  '{{blogsCount}}',
                  queries.maxBlogCount?.toString() || '0'
                )}
              </h5>
              <div className="row">
                {blogs.map((item, index) => (
                  <MemoizedComponentBlog
                    className={`col-md-4 mt-4`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
            <div className="w-100 pt-5 text-center show-more">
              {isActiveShowMoreButton ? (
                <ComponentLoadingButton
                  text={t('showMore')}
                  onClick={() => onClickShowMore()}
                />
              ) : null}
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

    const appState = store.getState().appState;

    const queries: IPageQueries = {
      author: null,
      blogs: [],
      category: null,
      maxBlogCount: 0,
      params: {
        author: '',
        category: '',
        page: 1,
        search: '',
      },
    };

    const page = Number(context.query?.page ?? 1) || 1;
    const search = decodeURI((context.query?.search as string) || '');
    const categoryURL = decodeURI((context.query?.category as string) || '');
    const authorURL = decodeURI((context.query?.author as string) || '');

    queries.params.search = search;
    queries.params.page = page;
    queries.params.category = categoryURL;
    queries.params.author = authorURL;

    await PageSSRUtil.init(store, {
      req: req,
      url: 'blogs',
      typeId: PageTypeId.Blogs,
      increaseView: true,
    });

    const pageState = store.getState().pageState;

    if (pageState.page) {
      let categoryId = '';
      if (categoryURL.length > 0) {
        const serviceResultCategory = await PostTermService.getWithURL({
          typeId: PostTermTypeId.Category,
          postTypeId: PostTypeId.Blog,
          langId: appState.selectedLangId,
          statusId: StatusId.Active,
          url: categoryURL,
        });

        if (serviceResultCategory.status && serviceResultCategory.data) {
          const category = serviceResultCategory.data;
          queries.category = category;
          categoryId = category._id;

          await PostTermService.updateViewWithId({
            _id: category._id,
            typeId: category.typeId,
            postTypeId: category.postTypeId,
            langId: appState.selectedLangId,
            url: EndPoints.BLOGS_WITH.CATEGORY(categoryURL),
          });
        }
      }

      let authorId = '';
      if (authorURL) {
        const serviceResultAuthor = await UserService.getWithURL({
          statusId: StatusId.Active,
          url: authorURL,
        });

        if (serviceResultAuthor.status && serviceResultAuthor.data) {
          const author = serviceResultAuthor.data;
          queries.author = author;
          authorId = author._id;
        }
      }

      const serviceResultBlogs = await PostService.getMany({
        langId: appState.selectedLangId,
        typeId: [PostTypeId.Blog],
        statusId: StatusId.Active,
        count: perPageBlogCount,
        page: page,
        ...(search ? { title: search } : {}),
        ...(categoryId ? { categories: [categoryId] } : {}),
        ...(authorId ? { authorId: authorId } : {}),
      });

      if (serviceResultBlogs.status && serviceResultBlogs.data) {
        const blogs = serviceResultBlogs.data;
        queries.blogs = blogs;
      }

      const serviceResultMaxBlogCount = await PostService.getCount({
        typeId: PostTypeId.Blog,
        statusId: StatusId.Active,
        ...(search ? { title: search } : {}),
        ...(categoryId ? { categories: [categoryId] } : {}),
        ...(authorId ? { authorId: authorId } : {}),
      });

      if (serviceResultMaxBlogCount.status && serviceResultMaxBlogCount.data) {
        queries.maxBlogCount = serviceResultMaxBlogCount.data;
      }
    }

    store.dispatch(setQueriesState(queries));

    return {
      props: {},
    };
  }
);
