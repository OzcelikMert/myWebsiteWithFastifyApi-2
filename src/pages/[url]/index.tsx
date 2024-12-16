import React from 'react';
import { PageSSRUtil } from '@utils/ssr/page.ssr.util';
import { PageTypeId } from '@constants/pageTypes';
import ComponentThemeSelectedComponents from '@components/theme/selectedComponents';
import ComponentAppLayout from '@components/app/layout';
import { wrapper } from '@lib/store';
import { setQueriesState } from '@lib/features/pageSlice';
import { useAppSelector } from '@lib/hooks';

type IPageQueries = {
  url: string;
};

export default function PageURL() {
  const page = useAppSelector((state) => state.pageState.page);
  const queries = useAppSelector(
    (state) => state.pageState.queries as IPageQueries
  );

  return (
    <ComponentAppLayout pageTitle={`${page?.contents?.title || queries.url}`}>
      <div className="page page-default">
        <ComponentThemeSelectedComponents />
      </div>
    </ComponentAppLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const req = context.req;
    let queries: IPageQueries = {
      url: ""
    }

    let url = (context.params?.url as string) || '';
    queries.url = decodeURI(url);

    store.dispatch(setQueriesState(queries));

    await PageSSRUtil.init(store, {
      req: req,
      url: url,
      typeId: PageTypeId.Default,
      increaseView: true,
    });

    return {
      props: {},
    };
  }
);
