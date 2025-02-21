import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  ILanguageGetManyParamService,
  ILanguageGetResultService,
  ILanguageGetWithIdParamService,
} from 'types/services/language.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';

const getWithId = (
  params: ILanguageGetWithIdParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET_WITH_ID(params._id),
    data: params,
    signal,
  }).get<ILanguageGetResultService>();
};

const getDefault = (signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET_DEFAULT,
    signal,
  }).get<ILanguageGetResultService>();
};

const getMany = (
  params: ILanguageGetManyParamService,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET,
    data: params,
    signal,
  }).get<ILanguageGetResultService[]>();
};

const getFlags = (params: {}, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET_FLAGS,
    data: params,
    signal,
  }).get<string[]>();
};

export const LanguageService = {
  getWithId: getWithId,
  getDefault: getDefault,
  getMany: getMany,
  getFlags: getFlags,
};
