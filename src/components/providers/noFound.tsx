import React from 'react';
import ComponentThemeError404 from '@components/theme/error404';
import { ComponentKey } from '@constants/componentKeys';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  children: React.ReactNode;
};

const ProviderNoFound = (props: IComponentProps) => {
  const pageState = useAppSelector((state) => state.pageState);

  if (!pageState.page) {
    const component404 = pageState.publicComponents.findSingle(
      'key',
      ComponentKey.Error404
    );
    return component404 ? (
      <ComponentThemeError404 component={component404} />
    ) : null;
  }

  return props.children;
};

export default ProviderNoFound;
