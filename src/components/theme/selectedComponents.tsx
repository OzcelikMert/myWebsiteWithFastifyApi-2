import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { useAppSelector } from '@lib/hooks';
import ComponentThemeAuthors from './authors';
import ComponentThemeCategories from './categories';
import ComponentThemeContactPageForm from './contactPageForm';
import ComponentThemeError404 from './error404';
import ComponentThemeFeatures from './features';
import ComponentThemeFooter from './footer';
import ComponentThemeHeader from './header';
import ComponentThemeHero from './hero';
import ComponentThemeHotBlogs from './hotBlogs';
import ComponentThemeHotCategories from './hotCategories';
import ComponentThemeLastBlogs from './lastBlogs';
import ComponentThemeNavbar from './navbar';
import ComponentThemeSubscribe from './subscribe';

type IComponentProps = {};

const componentRegistry: Record<string, React.ComponentType<any>> = {
  authors: ComponentThemeAuthors,
  categories: ComponentThemeCategories,
  contactPageForm: ComponentThemeContactPageForm,
  error404: ComponentThemeError404,
  features: ComponentThemeFeatures,
  footer: ComponentThemeFooter,
  header: ComponentThemeHeader,
  hero: ComponentThemeHero,
  hotBlogs: ComponentThemeHotBlogs,
  hotCategories: ComponentThemeHotCategories,
  lastBlogs: ComponentThemeLastBlogs,
  navbar: ComponentThemeNavbar,
  subscribe: ComponentThemeSubscribe
};

export default function ComponentThemeSelectedComponents({}: IComponentProps) {
  const privateComponents = useAppSelector(state => state.pageState.privateComponents);

  const getElement = (component: IComponentGetResultService) => {
    let element = <div></div>;

    try {
      const ComponentClass: any = componentRegistry[component.key];

      if(ComponentClass){
        element = <ComponentClass component={component} key={`selectedComponent_${component._id}`} />;
      }
    } catch (e) {
      console.error("ComponentThemeSelectedComponents", e);
    }

    return element;
  };

  return privateComponents?.map((component: any) =>
    getElement(component) || null
  );
}