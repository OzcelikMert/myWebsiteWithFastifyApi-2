import { SocialMediaKey } from '@constants/socialMediaKeys';
import { IComponentElementContentModel } from 'types/models/component.model';
import { IComponentGetResultService } from 'types/services/component.service';
import { ISettingGetResultService } from 'types/services/setting.service';

const getComponentElementContents = (component: IComponentGetResultService) => {
  return (key: string): IComponentElementContentModel | undefined =>
    component?.elements.findSingle('key', key)?.contents;
};

const getSocialMediaURL = (
  socialMedia: ISettingGetResultService['socialMedia']
) => {
  return (key: SocialMediaKey): string | undefined =>
    socialMedia?.findSingle('key', key)?.url;
};

export const HelperUtil = {
  getComponentElementContents: getComponentElementContents,
  getSocialMediaURL: getSocialMediaURL,
};
