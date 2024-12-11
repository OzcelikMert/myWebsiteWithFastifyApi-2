import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@lib/store';
import { IPageData, IPagePropCommon } from 'types/pageProps';
import { ComponentKey } from '@constants/componentKeys';
import { setLanguageState } from '@lib/features/languageSlice';

export default function StoreProvider({
  pageProps,
  children,
}: {
  pageProps: IPagePropCommon;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();

    const componentStaticContents =
      pageProps.pageData.publicComponents.findSingle(
        'key',
        ComponentKey.StaticContents
      );

    if (componentStaticContents) {
      storeRef.current.dispatch(setLanguageState(componentStaticContents));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
