import React from 'react';
import { IPostGetManyResultService } from 'types/services/post.service';
import ComponentBlog from '@components/elements/blog';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { IFuncComponentServerSideProps } from 'types/components/ssr';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService<{
    hotBlogs?: IPostGetManyResultService[];
  }>;
};

function ComponentThemeHotBlogs({ component }: IComponentProps) {
  let componentElementContents =
    HelperUtil.getComponentElementContents(component);


  const HotBlog = () => {
    const item = component.customData!.hotBlogs![0];
    return (
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
                  item={item}
                  index={0}
                  imageWidth={1000}
                  imageHeight={500}
                />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const HotBlogs = () => {
    const items = component.customData?.hotBlogs?.filter(
      (value, index) => index != 0
    );
    return (
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
              {items?.map((item, index) => (
                <AnimationOnScroll
                  animateIn="animate__fadeInRight"
                  delay={(index + 1) * 100}
                  animateOnce={true}
                  className="col-md-12 mt-4"
                  animatePreScroll={false}
                >
                  <ComponentBlog
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
    );
  };

  let hotBlogsLength = (component.customData?.hotBlogs?.length ?? 0);

  return hotBlogsLength > 0 ? (
    <section className="hot-blogs-section" id="hot-blogs">
      <div className="container">
        <div className="row d-flex">
          <div className="col-lg-8">
            <HotBlog />
          </div>
          <div className="col-lg-4 ps-lg-5">
            {
              hotBlogsLength > 1
                ? <HotBlogs />
                : null
            }
          </div>
        </div>
      </div>
    </section>
  ) : null;
}

const componentServerSideProps: IFuncComponentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.hotBlogs = (
    await PostService.getMany({
      langId: appState.selectedLangId,
      typeId: [PostTypeId.Blog],
      statusId: StatusId.Active,
      count: 4,
    })
  ).data;
};

ComponentThemeHotBlogs.componentServerSideProps = componentServerSideProps;

export default ComponentThemeHotBlogs;
