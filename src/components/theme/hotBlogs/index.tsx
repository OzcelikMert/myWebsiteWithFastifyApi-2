import React from 'react';
import { IPostGetManyResultService } from 'types/services/post.service';
import ComponentBlog from '@components/elements/blog';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService<{
    hotBlogs?: IPostGetManyResultService[];
  }>;
};

const ComponentThemeHotBlogs: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    const hotBlogsLength = props.component.customData?.hotBlogs?.length ?? 0;
    let recentBlog = null;
    if (hotBlogsLength > 0) {
      recentBlog = props.component.customData?.hotBlogs![0];
    }
    const hotBlogs =
      props.component.customData?.hotBlogs?.filter(
        (item) => item._id != recentBlog?._id
      ) ?? [];

    return hotBlogsLength > 0 ? (
      <section className="hot-blogs-section" id="hot-blogs">
        <div className="container">
          <div className="row d-flex">
            <div className="col-lg-8">
              {recentBlog ? (
                <section className="recent-blog-section">
                  <div className="container">
                    <AnimationOnScroll
                      animateIn="animate__fadeInDown"
                      animateOnce={true}
                      animatePreScroll={false}
                    >
                      <h2 className="section-header">
                        {componentElementContents('hotTitle')?.content}
                      </h2>
                    </AnimationOnScroll>
                    <AnimationOnScroll
                      animateIn="animate__fadeInDown"
                      delay={200}
                      animateOnce={true}
                      animatePreScroll={false}
                    >
                      <p className="section-content">
                        {componentElementContents('hotDescribe')?.content}
                      </p>
                    </AnimationOnScroll>
                    <div className="d-flex blogs">
                      <div className="row">
                        <AnimationOnScroll
                          animateIn="animate__fadeInLeft"
                          delay={200}
                          animateOnce={true}
                          className="col-md-12"
                          animatePreScroll={false}
                        >
                          <ComponentBlog
                            key={`recent-blog-${recentBlog._id}`}
                            item={recentBlog}
                            index={0}
                            imageWidth={1000}
                            imageHeight={500}
                          />
                        </AnimationOnScroll>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
            <div className="col-lg-4 ps-lg-5">
              {hotBlogsLength > 1 ? (
                <section className="featured-blogs-section">
                  <div className="container">
                    <AnimationOnScroll
                      animateIn="animate__fadeInDown"
                      animateOnce={true}
                      animatePreScroll={false}
                    >
                      <h2 className="section-header">
                        {componentElementContents('hotsTitle')?.content}
                      </h2>
                    </AnimationOnScroll>
                    <div className="blogs">
                      <div className="row">
                        {hotBlogs.map((item, index) => (
                          <AnimationOnScroll
                            key={`hot-blog-${item._id}-animation`}
                            animateIn="animate__fadeInRight"
                            delay={(index + 1) * 100}
                            animateOnce={true}
                            className="col-md-12 mt-4"
                            animatePreScroll={false}
                          >
                            <ComponentBlog
                              key={`hot-blog-${item._id}`}
                              item={item}
                              index={index}
                              hideAuthorImage={true}
                              hideShortContent={true}
                              hideCategories={true}
                            />
                          </AnimationOnScroll>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    ) : null;
  });

ComponentThemeHotBlogs.componentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.hotBlogs = (
    await PostService.getMany(
      {
        langId: appState.selectedLangId,
        typeId: [PostTypeId.Blog],
        statusId: StatusId.Active,
        count: 4,
      },
      req.abortController.signal
    )
  ).data;
};

export default ComponentThemeHotBlogs;
