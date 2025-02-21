import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  ISettingGetParamService,
  ISettingGetResultService,
} from 'types/services/setting.service';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';

const get = (params: ISettingGetParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.GET,
    data: params,
    signal,
  }).get<ISettingGetResultService>();
};

export const SettingService = {
  get: get,
};
