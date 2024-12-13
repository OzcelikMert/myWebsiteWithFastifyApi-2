import { SocialMediaKey } from '@constants/socialMediaKeys';
import { IAppState } from '@lib/features/appSlice';
import { IComponentElementContentModel } from 'types/models/component.model';
import { IComponentGetResultService } from 'types/services/component.service';
import { ISettingGetResultService } from 'types/services/setting.service';

const getComponentElementContents = (
  component: IComponentGetResultService,
  key: string
): IComponentElementContentModel | undefined => {
  return component?.elements.findSingle('key', key)?.contents;
};

const getSocialMediaURL = (
  socialMedia: ISettingGetResultService["socialMedia"],
  key: SocialMediaKey
): string | undefined => {
  return socialMedia?.findSingle('key', key)?.url;
};

export const HelperUtil = {
  getComponentElementContents: getComponentElementContents,
  getSocialMediaURL: getSocialMediaURL,
};
