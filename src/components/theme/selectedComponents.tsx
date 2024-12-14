import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {};

export default function ComponentThemeSelectedComponents({}: IComponentProps) {
  const privateComponents = useAppSelector(state => state.pageState.privateComponents);

  const getElement = (component: IComponentGetResultService) => {
    let element = <div></div>;

    try {
      const ComponentClass = require(`components/theme/${component.key}`)
        .default as any;
      element = <ComponentClass component={component} />;
    } catch (e) {}

    return element;
  };

  return privateComponents?.map((component) =>
    getElement(component)
  );
}