import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IUserGetManyParamService,
  IUserGetResultService,
  IUserGetWithURLParamService,
} from 'types/services/user.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';

const getWithURL = (
  params: IUserGetWithURLParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.GET_WITH_URL(params.url),
    data: params,
    signal,
  }).get<IUserGetResultService>();
};

const getMany = (params: IUserGetManyParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.GET,
    data: params,
    signal,
  }).get<IUserGetResultService[]>();
};

export const UserService = {
  getWithURL: getWithURL,
  getMany: getMany,
};
