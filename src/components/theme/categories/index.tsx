import React, { useState } from 'react';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { PostTermService } from '@services/postTerm.service';
import { PostTermTypeId } from '@constants/postTermTypes';
import ComponentCategory from '@components/elements/category';
import { IComponentGetResultService } from 'types/services/component.service';
import { IFuncComponentServerSideProps } from 'types/components/ssr';
import { HelperUtil } from '@utils/helper.util';

type IComponentState = {
  selectedCategoryId: string;
};

type IComponentProps = {
  component: IComponentGetResultService<{
    categories?: IPostTermGetResultService[];
  }>;
};

function ComponentThemeCategories({ component }: IComponentProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<IComponentState['selectedCategoryId']>('');
  let componentElementContents =
    HelperUtil.getComponentElementContents(component);

  const onMouseOver = (item: IPostTermGetResultService) => {
    setSelectedCategoryId(item._id);
  };

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-header animate__animated animate__fadeInDown animate__fast">
          {componentElementContents('title')?.content}
        </h2>
        <p className="section-content animate__animated animate__fadeInDown animate__delay-1s">
          {componentElementContents('describe')?.content}
        </p>
        <div className="categories-container">
          <div className="options">
            {component.customData?.categories?.map((category, index) => (
              <ComponentCategory
                key={`categories_${category._id}`}
                item={category}
                index={index}
                onMouseOver={(item) => onMouseOver(item)}
                isSelected={category._id == selectedCategoryId}
              />
            ))}
          </div>
        </div>
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
    })
  ).data;
};

ComponentThemeCategories.componentServerSideProps = componentServerSideProps;

export default ComponentThemeCategories;
