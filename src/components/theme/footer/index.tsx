import React from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { SocialMediaKey } from '@constants/socialMediaKeys';
import { NavigationService } from '@services/navigation.service';
import { StatusId } from '@constants/status';
import { PostService } from '@services/post.service';
import { PostTypeId } from '@constants/postTypes';
import { PostSortTypeId } from '@constants/postSortTypes';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { IPostGetManyResultService } from 'types/services/post.service';
import { UrlUtil } from '@utils/url.util';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@lib/hooks';
import { HelperUtil } from '@utils/helper.util';
import { IFuncComponentServerSideProps } from 'types/components/ssr';

type IComponentProps = {
  component: IComponentGetResultService<{
    navigations?: INavigationGetResultService[];
    hotBlogs?: IPostGetManyResultService[];
    hitBlogs?: IPostGetManyResultService[];
  }>;
};

function ComponentThemeFooter({component}: IComponentProps) {
  const appState = useAppSelector(state => state.appState);

  const Languages = () => {
    return (
      <div className="text-start mt-3">
        <small className="fw-bold">
          {HelperUtil.getComponentElementContents(component, 'languagesTitle')?.content}:
        </small>
        <span>
          {appState.languages.map((language, index) => (
            <a
              href={
                language._id == appState.selectedLangId
                  ? '#'
                  : UrlUtil.replaceLanguageCode({
                      url: appState.url,
                      newLanguage: language,
                    })
              }
              className={`ms-2 ${language._id == appState.selectedLangId ? 'text-muted' : ''}`}
            >
              <span>
                <Image
                  src={ImageSourceUtil.getFlagSrc(language.image)}
                  alt={language.title}
                  className="img-fluid"
                  height={10}
                  width={15}
                />
                <small className="ms-1">{language.title}</small>
              </span>
            </a>
          ))}
        </span>
      </div>
    );
  };

  const Copyright = () => {
    return (
      <div className="text-center mt-3">
        <small>
          © {appState.settings.seoContents?.title}{' '}
          {new Date().getStringWithMask('yyyy')}. All rights reserved.
        </small>
      </div>
    );
  };

  const Main = () => {
    return (
      <div className="row d-flex flex-wrap border-top pt-2 pt-md-5">
        <div className="col-12 col-lg-4 mt-3 mt-md-0">
          <h1 className="fw-bold">
            {appState.settings.seoContents?.title}
          </h1>
          <p>{HelperUtil.getComponentElementContents(component, 'describe')?.content}</p>
        </div>
        <div className="col-6 col-lg-2 mt-3 mt-md-0">
          <h4>{HelperUtil.getComponentElementContents(component, 'socialTitle')?.content}</h4>
          <ul>
            <li>
              <a href={HelperUtil.getSocialMediaURL(appState.settings.socialMedia, SocialMediaKey.Twitter)}>
                <span>
                  <i className="mdi mdi-twitter"></i> Twitter
                </span>
              </a>
            </li>
            <li>
              <a href={HelperUtil.getSocialMediaURL(appState.settings.socialMedia, SocialMediaKey.Instagram)}>
                <span>
                  <i className="mdi mdi-instagram"></i> Instagram
                </span>
              </a>
            </li>
            <li>
              <a href={HelperUtil.getSocialMediaURL(appState.settings.socialMedia, SocialMediaKey.Facebook)}>
                <span>
                  <i className="mdi mdi-facebook"></i> Facebook
                </span>
              </a>
            </li>
            <li>
              <a href={HelperUtil.getSocialMediaURL(appState.settings.socialMedia, SocialMediaKey.Youtube)}>
                <span>
                  <i className="mdi mdi-youtube"></i> Youtube
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-6 col-lg-2 mt-3 mt-md-0">
          <h4>{HelperUtil.getComponentElementContents(component, 'pagesTitle')?.content}</h4>
          <ul>
            {component.customData?.navigations?.map((navigation) => (
              <li>
                <a href={navigation.contents?.url}>
                  <span>{navigation.contents?.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-lg-2 mt-3 mt-md-0">
          <h4>{HelperUtil.getComponentElementContents(component, 'hotBlogsTitle')?.content}</h4>
          <ul>
            {component.customData?.hotBlogs?.map((blog) => (
              <li>
                <a href={blog.contents?.url}>
                  <span>{blog.contents?.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-lg-2 mt-3 mt-md-0">
          <h4>{HelperUtil.getComponentElementContents(component, 'hitBlogsTitle')?.content}</h4>
          <ul>
            {component.customData?.hitBlogs?.map((blog) => (
              <li>
                <a href={blog.contents?.url}>
                  <span>{blog.contents?.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <Main />
        <Languages />
        <Copyright />
      </div>
    </footer>
  );
}

const componentServerSideProps: IFuncComponentServerSideProps = async (store, req, component) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.navigations =
    (
      await NavigationService.getMany({
        langId: appState.selectedLangId,
        statusId: StatusId.Active,
        isSecondary: true,
      })
    ).data ?? [];

  component.customData.hotBlogs =
    (
      await PostService.getMany({
        langId: appState.selectedLangId,
        statusId: StatusId.Active,
        typeId: [PostTypeId.Blog],
        sortTypeId: PostSortTypeId.Newest,
        count: 4,
      })
    ).data ?? [];

  component.customData.hitBlogs =
    (
      await PostService.getMany({
        langId: appState.selectedLangId,
        statusId: StatusId.Active,
        typeId: [PostTypeId.Blog],
        sortTypeId: PostSortTypeId.MostPopular,
        count: 4,
      })
    ).data ?? [];
};

ComponentThemeFooter.componentServerSideProps = componentServerSideProps;

export default ComponentThemeFooter;
