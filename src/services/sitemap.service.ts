import { ApiEndPoints } from '@constants/apiEndPoints';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';
import {
  ISitemapGetMapsResultService,
  ISitemapGetPostParamService,
  ISitemapGetPostResultService,
  ISitemapGetPostTermParamService,
  ISitemapGetPostTermResultService,
} from 'types/services/sitemap.service';

const getMaps = (signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SITEMAP_WITH.GET_MAPS,
    signal,
  }).get<ISitemapGetMapsResultService>();
};

const getPost = (params: ISitemapGetPostParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SITEMAP_WITH.GET_POST,
    data: params,
    signal,
  }).get<ISitemapGetPostResultService[]>();
};

const getPostTerm = (
  params: ISitemapGetPostTermParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SITEMAP_WITH.GET_POST_TERM,
    data: params,
    signal,
  }).get<ISitemapGetPostTermResultService[]>();
};

export const SitemapService = {
  getMaps: getMaps,
  getPost: getPost,
  getPostTerm: getPostTerm,
};
