import { ApiEndPoints } from '@constants/apiEndPoints';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';
import {
  IComponentGetManyParamService,
  IComponentGetResultService,
  IComponentGetWithKeyParamService,
  IComponentGetWithIdParamService,
} from 'types/services/component.service';

const getWithId = (
  params: IComponentGetWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.COMPONENT_WITH.GET_WITH_ID(params._id),
    data: params,
    signal,
  }).get<IComponentGetResultService>();
};

const getWithKey = (
  params: IComponentGetWithKeyParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.COMPONENT_WITH.GET_WITH_KEY(params.key),
    data: params,
    signal,
  }).get<IComponentGetResultService>();
};

const getMany = (
  params: IComponentGetManyParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.COMPONENT_WITH.GET,
    data: params,
    signal,
  }).get<IComponentGetResultService[]>();
};

export const ComponentService = {
  getWithId: getWithId,
  getWithKey: getWithKey,
  getMany: getMany,
};
