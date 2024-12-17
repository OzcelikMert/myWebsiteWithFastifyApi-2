import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { IncomingMessage } from 'http';
import { PostService } from '@services/post.service';
import { IPageGetParamUtil } from 'types/utils/page.util';
import { ComponentService } from '@services/component.service';
import { ComponentTypeId } from '@constants/componentTypes';
import { IComponentGetResultService } from 'types/services/component.service';
import { IAppStore } from '@lib/store';
import {
  setPageState,
  setPrivateComponentsState,
  setPublicComponentsState,
} from '@lib/features/pageSlice';

const init = async (store: IAppStore, params: IPageGetParamUtil) => {
  const { appState } = store.getState();

  const serviceResultPage = await PostService.getWithURL({
    langId: appState.selectedLangId,
    typeId: PostTypeId.Page,
    statusId: StatusId.Active,
    url: params.url ?? '',
    ...(params.typeId ? { pageTypeId: params.typeId } : {}),
  });

  if (serviceResultPage.status && serviceResultPage.data) {
    store.dispatch(setPageState(serviceResultPage.data));

    if (params.increaseView) {
      await PostService.updateViewWithId({
        _id: serviceResultPage.data._id,
        typeId: serviceResultPage.data.typeId,
        langId: appState.selectedLangId ?? '',
        url: params.url,
      });
    }

    if (
      serviceResultPage.data.components &&
      serviceResultPage.data.components.length > 0
    ) {
      await initPrivateComponents(store, params.req);
    }
  }
};

const initPrivateComponents = async (
  store: IAppStore,
  req: IncomingMessage
) => {
  const { appState, pageState } = store.getState();

  if (pageState.page && pageState.page.components) {
    const serviceResult = await ComponentService.getMany({
      langId: appState.selectedLangId,
      typeId: ComponentTypeId.Private,
      withContent: true,
      withCustomSort: true,
      _id: pageState.page.components,
    });

    if (serviceResult.status && serviceResult.data) {
      await initComponentSSRProps(store, req, serviceResult.data);
      store.dispatch(setPrivateComponentsState(serviceResult.data));
    }
  }
};

const initPublicComponents = async (store: IAppStore, req: IncomingMessage) => {
  const { appState, pageState } = store.getState();

  const serviceResult = await ComponentService.getMany({
    langId: appState.selectedLangId,
    typeId: ComponentTypeId.Public,
    withContent: true,
  });

  if (serviceResult.status && serviceResult.data) {
    await initComponentSSRProps(store, req, serviceResult.data);
    store.dispatch(setPublicComponentsState(serviceResult.data));
  }
};

const initComponentSSRProps = async (
  store: IAppStore,
  req: IncomingMessage,
  components: IComponentGetResultService[]
) => {
  for (const component of components ?? []) {
    try {
      const componentClass = (
        await import(`@components/theme/${component.key}`)
      ).default as any;
      if (componentClass.componentServerSideProps) {
        await componentClass.componentServerSideProps(store, req, component);
      }
    } catch (e) {}
  }
};

export const PageSSRUtil = {
  init: init,
  initPublicComponents: initPublicComponents,
};
