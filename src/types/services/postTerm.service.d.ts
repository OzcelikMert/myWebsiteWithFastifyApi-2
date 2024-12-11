import { IUserPopulateService } from './user.service';
import {
  IPostTermContentModel,
  IPostTermModel,
} from '../models/postTerm.model';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';

export interface IPostTermPopulateService {
  _id: string;
  typeId: number;
  contents: {
    langId: string;
    title?: string;
    image?: string;
    url?: string;
  };
}

export interface IPostTermAlternateService {
  langId: string;
  title?: string;
  url?: string;
}

export type IPostTermGetResultService = {
  authorId: IUserPopulateService;
  lastAuthorId: IUserPopulateService;
  parentId?: IPostTermPopulateService;
  contents?: IPostTermContentModel;
  alternates?: IPostTermAlternateService[];
  postCount?: number;
} & Omit<IPostTermModel, 'contents' | 'authorId' | 'lastAuthorId' | 'parentId'>;

export interface IPostTermGetWithIdParamService {
  _id: string;
  langId?: string;
  typeId: PostTermTypeId;
  postTypeId: PostTypeId;
  statusId?: StatusId;
}

export interface IPostTermGetWithURLParamService {
  url: string;
  langId?: string;
  typeId: PostTermTypeId;
  postTypeId: PostTypeId;
  statusId?: StatusId;
}

export interface IPostTermGetManyParamService {
  langId?: string;
  _id?: string[];
  typeId?: PostTermTypeId[];
  postTypeId: PostTypeId;
  url?: string;
  title?: string;
  statusId?: StatusId;
  ignoreTermId?: string[];
  count?: number;
  page?: number;
  withPostCount?: boolean;
  ignoreDefaultLanguage?: boolean;
}

export type IPostTermUpdateViewWithIdParamService = {
  _id: string;
  typeId: PostTermTypeId;
  postTypeId: PostTypeId;
  langId?: string;
  url?: string;
};
