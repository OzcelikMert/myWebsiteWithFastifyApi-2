import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, IAppStore } from '@lib/store';
import { ComponentKey } from '@constants/componentKeys';
import { setTranslationState } from '@lib/features/translationSlice';
import { AppProps } from 'next/app';
import { setRouterState } from '@lib/features/appSlice';

type IComponentProps = {
  children: React.ReactNode;
  router: AppProps['router'];
};

export default function StoreProvider({ children, router }: IComponentProps) {
  const storeRef = useRef<IAppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();

    storeRef.current.dispatch(setRouterState(router));

    const componentStaticContents = storeRef.current
      .getState()
      .pageState.publicComponents.findSingle('key', ComponentKey.StaticContents);

    if (componentStaticContents) {
      storeRef.current.dispatch(setTranslationState(componentStaticContents));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
