import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { useAppSelector } from '@lib/hooks';
import dynamic from 'next/dynamic';

type IComponentProps = {};

export default function ComponentThemeSelectedComponents({}: IComponentProps) {
  const privateComponents = useAppSelector(state => state.pageState.privateComponents);

  const getElement = (component: IComponentGetResultService) => {
    let element = <div></div>;

    try {
      const ComponentClass: any = dynamic(() => import(`@components/theme/${component.key}`).then(mod => mod.default));
      
      if(ComponentClass){
        element = <ComponentClass component={component} />;
      }
    } catch (e) {
      console.log(e);
    }

    return element;
  };

  return privateComponents?.map((component: any) =>
    getElement(component) || null
  );
}