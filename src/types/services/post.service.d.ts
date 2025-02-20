import { IUserPopulateService } from 'types/services/user.service';
import { IPostTermPopulateService } from 'types/services/postTerm.service';
import {
  IPostContentModel,
  IPostModel,
  IPostECommerceModel,
  IPostECommerceVariationContentModel,
  IPostECommerceVariationModel,
} from 'types/models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { PageTypeId } from '@constants/pageTypes';
import { StatusId } from '@constants/status';
import { PostSortTypeId } from '@constants/postSortTypes';

export interface IPostAlternateService {
  langId: string;
  title?: string;
  url?: string;
}

export type IPostGetResultServiceECommerceVariation = {
  product?: Omit<
    IPostModel,
    '_id' | 'typeId' | 'contents' | 'authorId' | 'lastAuthorId'
  > & {
    _id?: string;
    alternates?: IPostAlternateService[];
    contents?: IPostContentModel;
    author?: IUserPopulateService;
    lastAuthor?: IUserPopulateService;
  };
} & IPostECommerceVariationModel;

export type IPostGetResultServiceECommerceAttribute<T = string> = {
  variationTerms: T[];
  attributeTerm?: IPostTermPopulateService;
} & Omit<IPostECommerceAttributeModel, 'variationTerms'>;

export type IPostGetResultServiceECommerce<T = string> = {
  variations: IPostGetResultServiceECommerceVariation[];
  attributes: IPostGetResultServiceECommerceAttribute<T>[];
} & Omit<IPostECommerceModel, 'variations' | 'attributes'>;

export type IPostGetResultService<T = IPostTermPopulateService> = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  authors?: IUserPopulateService[];
  views?: number;
  categories?: T[];
  tags?: T[];
  contents?: IPostContentModel;
  alternates?: IPostAlternateService[];
  eCommerce?: IPostGetResultServiceECommerce<T>;
} & Omit<
  IPostModel,
  'contents' | 'categories' | 'tags' | 'eCommerce' | 'authors'
>;

export type IPostGetManyResultService = {} & IPostGetResultService;

export interface IPostGetPrevNextResultService {
  _id: string;
  contents?: IPostContentModel;
  createdAt: string;
}

export interface IPostGetWithURLParamService {
  typeId: PostTypeId;
  url: string;
  pageTypeId?: PageTypeId;
  langId?: string;
  statusId?: StatusId;
}

export interface IPostGetManyParamService {
  _id?: string[];
  sortTypeId?: PostSortTypeId;
  typeId?: PostTypeId[];
  pageTypeId?: PageTypeId[];
  langId?: string;
  statusId?: StatusId;
  count?: number;
  page?: number;
  ignorePostId?: string[];
  title?: string;
  authorId?: string;
  categories?: string[];
  tags?: string[];
}

export interface IPostGetPrevNextParamService {
  _id: string;
  typeId: PostTypeId;
  statusId?: StatusId;
  langId?: string;
  categories?: string[];
  tags?: string[];
  authorId?: string;
}

export interface IPostGetCountParamService {
  typeId: PostTypeId;
  statusId?: StatusId;
  title?: string;
  categories?: string[];
  authorId?: string;
}

export type IPostUpdateViewWithIdParamService = {
  _id: string;
  typeId: PostTypeId;
  langId?: string;
  url?: string;
};
