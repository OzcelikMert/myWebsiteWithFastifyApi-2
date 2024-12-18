import React, { useState } from 'react';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { PostTermService } from '@services/postTerm.service';
import { PostTermTypeId } from '@constants/postTermTypes';
import ComponentCategory from '@components/elements/category';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { IComponentGetResultService } from 'types/services/component.service';
import { HelperUtil } from '@utils/helper.util';
import { IFuncComponentServerSideProps } from 'types/components/ssr';

type IComponentState = {
  selectedCategoryId: string;
};

type IComponentProps = {
  component: IComponentGetResultService<{
    categories?: IPostTermGetResultService[];
  }>;
};

function ComponentThemeHotCategories({ component }: IComponentProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<IComponentState['selectedCategoryId']>('');
  let componentElementContents =
    HelperUtil.getComponentElementContents(component);
  const onMouseOver = (item: IPostTermGetResultService) => {
    setSelectedCategoryId(item._id);
  };

  return (
    <section className="categories-section hot-categories-section">
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
          animateIn="animate__fadeInLeft"
          delay={500}
          animateOnce={true}
          animatePreScroll={false}
        >
          <div className="categories-container">
            <div className="options">
              {component.customData?.categories?.map((category, index) => (
                <ComponentCategory
                  key={`hotCategories_${category._id}`}
                  item={category}
                  index={index}
                  onMouseOver={(item) => onMouseOver(item)}
                  isSelected={
                    (selectedCategoryId == '' && index == 0) ||
                    category._id == selectedCategoryId
                  }
                />
              ))}
            </div>
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

  component.customData.categories = (
    await PostTermService.getMany({
      langId: appState.selectedLangId,
      typeId: [PostTermTypeId.Category],
      postTypeId: PostTypeId.Blog,
      statusId: StatusId.Active,
      count: 5,
    })
  ).data;
};

ComponentThemeHotCategories.componentServerSideProps = componentServerSideProps;

export default ComponentThemeHotCategories;
