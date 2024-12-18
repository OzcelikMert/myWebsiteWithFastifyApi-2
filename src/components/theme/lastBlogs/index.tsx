import React, { useState } from 'react';
import { IPostGetManyResultService } from 'types/services/post.service';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import ComponentBlog from '@components/elements/blog';
import ComponentLoadingButton from '@components/elements/button/loadingButton';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { IFuncComponentServerSideProps } from 'types/components/ssr';
import { useAppSelector } from '@lib/hooks';
import { HelperUtil } from '@utils/helper.util';
import { selectTranslation } from '@lib/features/translationSlice';

type IComponentState = {
  lastBlogs: IPostGetManyResultService[];
  isActiveShowMoreButton: boolean;
  pageNumber: number;
};

type IComponentProps = {
  component: IComponentGetResultService<{
    lastBlogs?: IPostGetManyResultService[];
    maxBlogCount?: number;
  }>;
};

const perPageBlogCount = 3;

function ComponentThemeLastBlogs({ component }: IComponentProps) {
  const [lastBlogs, setLastBlogs] = useState<IComponentState['lastBlogs']>(
    component.customData?.lastBlogs ?? []
  );
  const [isActiveShowMoreButton, setIsActiveShowMoreButton] =
    useState<IComponentState['isActiveShowMoreButton']>((component.customData?.maxBlogCount ?? 0) > lastBlogs.length);
  const [pageNumber, setPageNumber] =
    useState<IComponentState['pageNumber']>(1);

  const selectedLangId = useAppSelector(
    (state) => state.appState.selectedLangId
  );

  const t = useAppSelector(selectTranslation);

  let componentElementContents =
    HelperUtil.getComponentElementContents(component);

  const MemoizedComponentBlog = React.memo(ComponentBlog);

  const onClickShowMore = async () => {
    if (!isActiveShowMoreButton) return false;
    const newPageNumber = pageNumber + 1;
    const serviceResult = await PostService.getMany({
      langId: selectedLangId,
      typeId: [PostTypeId.Blog],
      statusId: StatusId.Active,
      count: perPageBlogCount,
      page: newPageNumber
    });
    if (serviceResult.status && serviceResult.data) {
      setPageNumber(newPageNumber);
      const newBlogs = [...lastBlogs, ...(serviceResult.data ?? [])];
      setLastBlogs(newBlogs);
      setIsActiveShowMoreButton(
        (component.customData?.maxBlogCount || 0) > newBlogs.length
      );
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
              {lastBlogs.map((item, index) => (
                <MemoizedComponentBlog
                  key={`lastBlogs_${item._id}`}
                  className={`col-md-4 mt-4 mt-md-0`}
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
        </AnimationOnScroll>
      </div>
    </section>
  );
}

const componentServerSideProps: IFuncComponentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.lastBlogs = (
    await PostService.getMany({
      langId: appState.selectedLangId,
      typeId: [PostTypeId.Blog],
      statusId: StatusId.Active,
      count: perPageBlogCount,
      page: 1,
    })
  ).data;

  component.customData.maxBlogCount = (
    await PostService.getCount({
      typeId: PostTypeId.Blog,
      statusId: StatusId.Active,
    })
  ).data;
};

ComponentThemeLastBlogs.componentServerSideProps = componentServerSideProps;

export default ComponentThemeLastBlogs;
