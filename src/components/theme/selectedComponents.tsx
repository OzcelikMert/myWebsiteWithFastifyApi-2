import React, { Component } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {};

export default function ComponentThemeSelectedComponents({}: IComponentProps) {
  const { pageState } = useAppSelector(state => state);

  const getElement = (component: IComponentGetResultService) => {
    let element = <div></div>;

    try {
      const ComponentClass = require(`components/theme/${component.key}`)
        .default as any;
      element = <ComponentClass component={component} />;
    } catch (e) {}

    return element;
  };

  return pageState.privateComponents?.map((component) =>
    getElement(component)
  );
}