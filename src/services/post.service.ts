import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IPostGetCountParamService,
  IPostGetManyParamService,
  IPostGetManyResultService,
  IPostGetResultService,
  IPostGetPrevNextParamService,
  IPostGetPrevNextResultService,
  IPostGetWithURLParamService,
  IPostUpdateViewWithIdParamService,
} from 'types/services/post.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';

const getWithURL = (
  params: IPostGetWithURLParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET_WITH_URL(params.url),
    data: params,
    signal,
  }).get<IPostGetResultService>();
};

const getMany = (params: IPostGetManyParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET,
    data: params,
    signal,
  }).get<IPostGetManyResultService[]>();
};

const getPrevNextWithId = (
  params: IPostGetPrevNextParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET_PREV_NEXT_WITH_ID(params._id),
    data: params,
    signal,
  }).get<{
    prev?: IPostGetPrevNextResultService;
    next?: IPostGetPrevNextResultService;
  }>();
};

const getCount = (params: IPostGetCountParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET_COUNT,
    data: params,
    signal,
  }).get<number>();
};

const updateViewWithId = (
  params: IPostUpdateViewWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.UPDATE_VIEW_WITH_ID(params._id),
    data: params,
    signal,
  }).put();
};

export const PostService = {
  getWithURL: getWithURL,
  getPrevNextWithId: getPrevNextWithId,
  getMany: getMany,
  getCount: getCount,
  updateViewWithId: updateViewWithId,
};
