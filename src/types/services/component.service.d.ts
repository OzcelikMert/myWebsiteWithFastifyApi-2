import { IUserPopulateService } from './user.service';
import {
  IComponentElementModel,
  IComponentModel,
} from 'types/models/component.model';
import { ComponentTypeId } from '@constants/componentTypes';

export interface IComponentAlternateService {
  langId: string;
}

export type IComponentGetResultServiceElement = {
  contents?: IComponentElementContentModel;
  alternates?: IComponentAlternateService[];
} & Omit<IComponentElementModel, 'contents'>;

export type IComponentGetResultService<T = { [key: string]: any }> = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  elements: IComponentGetResultServiceElement[];
} & Omit<IComponentModel<T>, 'elements'>;

export interface IComponentGetWithIdParamService {
  _id: string;
  langId?: string;
}

export interface IComponentGetWithKeyParamService {
  key: string;
  langId?: string;
}

export interface IComponentGetManyParamService {
  _id?: string[];
  key?: string[];
  langId?: string;
  typeId?: ComponentTypeId;
  withContent?: boolean;
  withCustomSort?: boolean;
}
