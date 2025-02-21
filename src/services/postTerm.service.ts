import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IPostTermGetResultService,
  IPostTermGetManyParamService,
  IPostTermGetWithIdParamService,
  IPostTermGetWithURLParamService,
  IPostTermUpdateViewWithIdParamService,
} from 'types/services/postTerm.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';

const getWithId = (
  params: IPostTermGetWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.GET_WITH_ID(params._id),
    data: params,
    signal,
  }).get<IPostTermGetResultService>();
};

const getWithURL = (
  params: IPostTermGetWithURLParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.GET_WITH_URL(params.url),
    data: params,
    signal,
  }).get<IPostTermGetResultService>();
};

const getMany = (
  params: IPostTermGetManyParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.GET,
    data: params,
    signal,
  }).get<IPostTermGetResultService[]>();
};

const updateViewWithId = (
  params: IPostTermUpdateViewWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.UPDATE_VIEW_WITH_ID(params._id),
    data: params,
    signal,
  }).put();
};

export const PostTermService = {
  getWithId: getWithId,
  getWithURL: getWithURL,
  getMany: getMany,
  updateViewWithId: updateViewWithId,
};
