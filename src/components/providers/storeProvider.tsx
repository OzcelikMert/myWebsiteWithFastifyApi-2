import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, IAppStore, wrapper } from '@lib/store';
import { ComponentKey } from '@constants/componentKeys';
import { setTranslationState } from '@lib/features/translationSlice';
import { AppProps } from 'next/app';
import { setRouterState } from '@lib/features/appSlice';

type IComponentProps = {
  pageProps: any
  children: React.ReactNode;
  router: AppProps['router'];
};

export default function StoreProvider({ children, router, pageProps }: IComponentProps) {
  //const { store, props } = wrapper.useWrappedStore(pageProps);
  //console.log("StoreProvider", store.getState());
  //console.log("StoreProvider", props);
  const storeRef = useRef<IAppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    //console.log("storeProvider", storeRef.current.getState())

    storeRef.current.dispatch(setRouterState(router));

    const componentStaticContents = storeRef.current
      .getState()
      .pageState.publicComponents.findSingle(
        'key',
        ComponentKey.StaticContents
      );

    if (componentStaticContents) {
      storeRef.current.dispatch(setTranslationState(componentStaticContents));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
