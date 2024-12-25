import React from 'react';
import ComponentThemeError404 from '@components/theme/error404';
import ComponentAppLayout from '@components/app/layout';
import { ComponentKey } from '@constants/componentKeys';
import { useAppSelector } from '@lib/hooks';

export default function Page404() {
  const publicComponents = useAppSelector(
    (state) => state.pageState.publicComponents
  );

  const component404 = publicComponents.findSingle(
    'key',
    ComponentKey.Error404
  );

  return (
    <ComponentAppLayout pageTitle={`404`}>
      <div className="page page-404">
        {component404 ? (
          <ComponentThemeError404 component={component404} />
        ) : null}
      </div>
    </ComponentAppLayout>
  );
}
