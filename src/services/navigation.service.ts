import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  INavigationGetWithIdParamService,
  INavigationGetManyParamService,
  INavigationGetResultService,
} from 'types/services/navigation.service';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';

const getWithId = (
  params: INavigationGetWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.GET_WITH_ID(params._id),
    data: params,
    signal,
  }).get<INavigationGetResultService>();
};

const getMany = (
  params: INavigationGetManyParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.GET,
    data: params,
    signal,
  }).get<INavigationGetResultService[]>();
};

export const NavigationService = {
  getWithId: getWithId,
  getMany: getMany,
};
