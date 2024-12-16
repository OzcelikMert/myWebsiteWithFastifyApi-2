import React from 'react';
import { PageSSRUtil } from '@utils/ssr/page.ssr.util';
import { PageTypeId } from '@constants/pageTypes';
import ComponentThemeSelectedComponents from '@components/theme/selectedComponents';
import ComponentAppLayout from '@components/app/layout';
import { wrapper } from '@lib/store';
import { useAppSelector } from '@lib/hooks';

export default function PageHome() {
  console.log("******PageHome*******", useAppSelector(state => state.pageState));
  

  return (
    <ComponentAppLayout>
      <div className="page page-home">
        <ComponentThemeSelectedComponents />
      </div>
    </ComponentAppLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const req = context.req;

    await PageSSRUtil.init(store, {
      req: req,
      url: 'homepage',
      typeId: PageTypeId.Home,
      increaseView: true,
    });

    console.log("******PageHome getServerSideProps*******", store.getState().pageState.page);

    return {
      props: {},
    };
  }
);
