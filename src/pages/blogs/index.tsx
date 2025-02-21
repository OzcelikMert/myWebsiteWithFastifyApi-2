import React, { useReducer, useState } from 'react';
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
import { UserService } from '@services/user.service';
import { IUserGetResultService } from 'types/services/user.service';
import { EndPoints } from '@constants/endPoints';
import { wrapper } from '@redux/store';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setQueriesState } from '@redux/features/pageSlice';
import { UrlUtil } from '@utils/url.util';
import ComponentPageBlogsHeaderButtons from '@components/pages/blogs/headerButtons';
import ComponentButtonWithLoading from '@components/elements/button/withLoading';
import { IActionWithPayload } from 'types/hooks';

const perPageBlogCount = 9;

type IComponentState = {
  blogs: IPostGetManyResultService[];
  hideShowMoreButton: boolean;
  pageNumber: number;
};

const initialState: IComponentState = {
  blogs: [],
  hideShowMoreButton: false,
  pageNumber: 1,
};

enum ActionTypes {
  SET_BLOGS,
  SET_HIDE_SHOW_MORE_BUTTON,
  SET_PAGE_NUMBER,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_BLOGS, IComponentState['blogs']>
  | IActionWithPayload<
      ActionTypes.SET_HIDE_SHOW_MORE_BUTTON,
      IComponentState['hideShowMoreButton']
    >
  | IActionWithPayload<
      ActionTypes.SET_PAGE_NUMBER,
      IComponentState['pageNumber']
    >;

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_BLOGS:
      return { ...state, blogs: action.payload };
    case ActionTypes.SET_HIDE_SHOW_MORE_BUTTON:
      return { ...state, hideShowMoreButton: action.payload };
    case ActionTypes.SET_PAGE_NUMBER:
      return { ...state, pageNumber: action.payload };
    default:
      return state;
  }
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
  const abortControllerRef = React.useRef(new AbortController());

  const queries = useAppSelector(
    (state) => state.pageState.queries as IPageQueries
  );

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    pageNumber: queries.params.page || 1,
    blogs: queries.blogs ?? [],
    hideShowMoreButton: queries.maxBlogCount <= (queries.blogs ?? []).length,
  });

  const page = useAppSelector((state) => state.pageState.page);
  const appState = useAppSelector((state) => state.appState);

  const t = useAppSelector(selectTranslation);

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
    if (state.hideShowMoreButton) return;
    const newPageNumber = state.pageNumber + 1;
    const serviceResult = await PostService.getMany(
      {
        langId: appState.selectedLangId,
        typeId: [PostTypeId.Blog],
        statusId: StatusId.Active,
        count: perPageBlogCount,
        page: state.pageNumber,
        ...(queries.category ? { categories: [queries.category._id] } : {}),
        ...(queries.params.search ? { title: queries.params.search } : {}),
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({ type: ActionTypes.SET_PAGE_NUMBER, payload: newPageNumber });
      const newBlogs = [...state.blogs, ...(serviceResult.data ?? [])];
      dispatch({ type: ActionTypes.SET_BLOGS, payload: newBlogs });
      dispatch({
        type: ActionTypes.SET_HIDE_SHOW_MORE_BUTTON,
        payload: queries.maxBlogCount <= newBlogs.length,
      });
    }
  };

  return (
    <ComponentAppLayout
      pageTitle={getPageTitle()}
      headerBgImage={queries.category?.contents?.image || queries.author?.image}
      headerContent={
        queries.category?.contents?.shortContent || queries.author?.comment
      }
      headerButtons={
        <ComponentPageBlogsHeaderButtons
          author={queries.author ?? undefined}
          onSearch={(text) => onSearch(text)}
        />
      }
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
                {state.blogs.map((item, index) => (
                  <ComponentBlog
                    key={`blog-${item._id}`}
                    className={`col-md-4 mt-4`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
            <div className="w-100 pt-5 text-center show-more">
              {state.hideShowMoreButton ? null : (
                <ComponentButtonWithLoading
                  text={t('showMore')}
                  onClick={() => onClickShowMore()}
                />
              )}
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
        const serviceResultCategory = await PostTermService.getWithURL(
          {
            typeId: PostTermTypeId.Category,
            postTypeId: PostTypeId.Blog,
            langId: appState.selectedLangId,
            statusId: StatusId.Active,
            url: categoryURL,
          },
          req.abortController.signal
        );

        if (serviceResultCategory.status && serviceResultCategory.data) {
          const category = serviceResultCategory.data;
          queries.category = category;
          categoryId = category._id;

          await PostTermService.updateViewWithId(
            {
              _id: category._id,
              typeId: category.typeId,
              postTypeId: category.postTypeId,
              langId: appState.selectedLangId,
              url: EndPoints.BLOGS_WITH.CATEGORY(categoryURL),
            },
            req.abortController.signal
          );
        }
      }

      let authorId = '';
      if (authorURL) {
        const serviceResultAuthor = await UserService.getWithURL(
          {
            statusId: StatusId.Active,
            url: authorURL,
          },
          req.abortController.signal
        );

        if (serviceResultAuthor.status && serviceResultAuthor.data) {
          const author = serviceResultAuthor.data;
          queries.author = author;
          authorId = author._id;
        }
      }

      const serviceResultBlogs = await PostService.getMany(
        {
          langId: appState.selectedLangId,
          typeId: [PostTypeId.Blog],
          statusId: StatusId.Active,
          count: perPageBlogCount,
          page: page,
          ...(search ? { title: search } : {}),
          ...(categoryId ? { categories: [categoryId] } : {}),
          ...(authorId ? { authorId: authorId } : {}),
        },
        req.abortController.signal
      );

      if (serviceResultBlogs.status && serviceResultBlogs.data) {
        const blogs = serviceResultBlogs.data;
        queries.blogs = blogs;
      }

      const serviceResultMaxBlogCount = await PostService.getCount(
        {
          typeId: PostTypeId.Blog,
          statusId: StatusId.Active,
          ...(search ? { title: search } : {}),
          ...(categoryId ? { categories: [categoryId] } : {}),
          ...(authorId ? { authorId: authorId } : {}),
        },
        req.abortController.signal
      );

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
