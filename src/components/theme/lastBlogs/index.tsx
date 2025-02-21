import React, { useReducer } from 'react';
import { IPostGetManyResultService } from 'types/services/post.service';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import ComponentBlog from '@components/elements/blog';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { useAppSelector } from '@redux/hooks';
import { HelperUtil } from '@utils/helper.util';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentButtonWithLoading from '@components/elements/button/withLoading';
import { IActionWithPayload } from 'types/hooks';

type IComponentState = {
  lastBlogs: IPostGetManyResultService[];
  hideShowMoreButton: boolean;
  pageNumber: number;
};

const initialState: IComponentState = {
  lastBlogs: [],
  hideShowMoreButton: false,
  pageNumber: 1,
};

enum ActionTypes {
  SET_LAST_BLOGS,
  SET_HIDE_SHOW_MORE_BUTTON,
  SET_PAGE_NUMBER,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_LAST_BLOGS, IComponentState['lastBlogs']>
  | IActionWithPayload<
      ActionTypes.SET_PAGE_NUMBER,
      IComponentState['pageNumber']
    >
  | IActionWithPayload<
      ActionTypes.SET_HIDE_SHOW_MORE_BUTTON,
      IComponentState['hideShowMoreButton']
    >;

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_LAST_BLOGS:
      return { ...state, lastBlogs: action.payload };
    case ActionTypes.SET_PAGE_NUMBER:
      return { ...state, pageNumber: action.payload };
    case ActionTypes.SET_HIDE_SHOW_MORE_BUTTON:
      return { ...state, hideShowMoreButton: action.payload };
    default:
      return state;
  }
};

type IComponentProps = {
  component: IComponentGetResultService<{
    lastBlogs?: IPostGetManyResultService[];
    maxBlogCount?: number;
  }>;
};

const perPageBlogCount = 3;

const ComponentThemeLastBlogs: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const abortControllerRef = React.useRef(new AbortController());

    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      lastBlogs: props.component.customData?.lastBlogs ?? [],
      hideShowMoreButton:
        (props.component.customData?.maxBlogCount ?? 0) <=
        (props.component.customData?.lastBlogs ?? []).length,
    });

    const selectedLangId = useAppSelector(
      (state) => state.appState.selectedLangId
    );

    const t = useAppSelector(selectTranslation);

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    const MemoizedComponentBlog = React.memo(ComponentBlog);

    const onClickShowMore = async () => {
      if (state.hideShowMoreButton) return;

      const newPageNumber = state.pageNumber + 1;
      const serviceResult = await PostService.getMany(
        {
          langId: selectedLangId,
          typeId: [PostTypeId.Blog],
          statusId: StatusId.Active,
          count: perPageBlogCount,
          page: newPageNumber,
        },
        abortControllerRef.current.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const newBlogs = [...state.lastBlogs, ...(serviceResult.data ?? [])];
        dispatch({ type: ActionTypes.SET_LAST_BLOGS, payload: newBlogs });
        dispatch({ type: ActionTypes.SET_PAGE_NUMBER, payload: newPageNumber });
        if (
          (props.component.customData?.maxBlogCount || 0) <= newBlogs.length
        ) {
          dispatch({
            type: ActionTypes.SET_HIDE_SHOW_MORE_BUTTON,
            payload: true,
          });
        }
      }
    };

    return (
      <section className="blogs-section">
        <div className="container">
          <AnimationOnScroll
            animateIn="animate__fadeInDown"
            animateOnce={true}
            animatePreScroll={false}
          >
            <h2 className="section-header">
              {componentElementContents('title')?.content}
            </h2>
          </AnimationOnScroll>
          <AnimationOnScroll
            animateIn="animate__fadeInDown"
            delay={200}
            animateOnce={true}
            animatePreScroll={false}
          >
            <p className="section-content">
              {componentElementContents('describe')?.content}
            </p>
          </AnimationOnScroll>
          <AnimationOnScroll
            animateIn="animate__fadeInRight"
            delay={400}
            animateOnce={true}
            animatePreScroll={false}
          >
            <div className="blogs">
              <div className="row">
                {state.lastBlogs.map((item, index) => (
                  <MemoizedComponentBlog
                    key={`last-blog-${item._id}`}
                    className={`col-md-4 mt-4 mt-md-0`}
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
          </AnimationOnScroll>
        </div>
      </section>
    );
  });

ComponentThemeLastBlogs.componentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.lastBlogs = (
    await PostService.getMany(
      {
        langId: appState.selectedLangId,
        typeId: [PostTypeId.Blog],
        statusId: StatusId.Active,
        count: perPageBlogCount,
        page: 1,
      },
      req.abortController.signal
    )
  ).data;

  component.customData.maxBlogCount = (
    await PostService.getCount(
      {
        typeId: PostTypeId.Blog,
        statusId: StatusId.Active,
      },
      req.abortController.signal
    )
  ).data;
};

export default ComponentThemeLastBlogs;
