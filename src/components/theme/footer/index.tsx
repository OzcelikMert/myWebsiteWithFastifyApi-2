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
import { useAppSelector } from '@redux/hooks';
import { HelperUtil } from '@utils/helper.util';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { EndPoints } from '@constants/endPoints';
import { ILanguageModel } from 'types/models/language.model';

const Navigation = React.memo((props: INavigationGetResultService) => {
  return (
    <li>
      <a href={props.contents?.url}>
        <span>{props.contents?.title}</span>
      </a>
    </li>
  );
});

const Language = React.memo((props: ILanguageModel) => {
  const appState = useAppSelector((state) => state.appState);

  return (
    <a
      href={
        props._id == appState.selectedLangId
          ? '#'
          : UrlUtil.replaceLanguageCode({
              url: appState.url,
              newLanguage: props,
            })
      }
      className={`ms-2 ${props._id == appState.selectedLangId ? 'text-muted' : ''}`}
    >
      <span>
        <Image
          src={ImageSourceUtil.getFlagSrc(props.image)}
          alt={props.title}
          className="img-fluid"
          height={10}
          width={15}
        />
        <small className="ms-1">{props.title}</small>
      </span>
    </a>
  );
});

type IComponentProps = {
  component: IComponentGetResultService<{
    navigations?: INavigationGetResultService[];
    hotBlogs?: IPostGetManyResultService[];
    hitBlogs?: IPostGetManyResultService[];
  }>;
};

const ComponentThemeFooter: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const url = useAppSelector((state) => state.appState.url);
    const appState = useAppSelector((state) => state.appState);

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    const socialMediaURL = HelperUtil.getSocialMediaURL(
      appState.settings.socialMedia
    );

    return (
      <footer className="footer-section">
        <div className="container">
          <div className="row d-flex flex-wrap border-top pt-2 pt-md-5">
            <div className="col-12 col-lg-4 mt-3 mt-md-0">
              <h1 className="fw-bold">
                {appState.settings.seoContents?.title}
              </h1>
              <p>{componentElementContents('describe')?.content}</p>
            </div>
            <div className="col-6 col-lg-2 mt-3 mt-md-0">
              <h4>{componentElementContents('socialTitle')?.content}</h4>
              <ul>
                <li>
                  <a href={socialMediaURL(SocialMediaKey.Twitter)}>
                    <span>
                      <i className="mdi mdi-twitter"></i> Twitter
                    </span>
                  </a>
                </li>
                <li>
                  <a href={socialMediaURL(SocialMediaKey.Instagram)}>
                    <span>
                      <i className="mdi mdi-instagram"></i> Instagram
                    </span>
                  </a>
                </li>
                <li>
                  <a href={socialMediaURL(SocialMediaKey.Facebook)}>
                    <span>
                      <i className="mdi mdi-facebook"></i> Facebook
                    </span>
                  </a>
                </li>
                <li>
                  <a href={socialMediaURL(SocialMediaKey.Youtube)}>
                    <span>
                      <i className="mdi mdi-youtube"></i> Youtube
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-lg-2 mt-3 mt-md-0">
              <h4>{componentElementContents('pagesTitle')?.content}</h4>
              <ul>
                {props.component.customData?.navigations?.map((item) => (
                  <Navigation
                    key={`secondary-nav-item-${item._id}`}
                    {...item}
                  />
                ))}
              </ul>
            </div>
            <div className="col-6 col-lg-2 mt-3 mt-md-0">
              <h4>{componentElementContents('hotBlogsTitle')?.content}</h4>
              <ul>
                {props.component.customData?.hotBlogs?.map((item) => (
                  <Navigation
                    key={`hot-blog-item-${item._id}`}
                    {...item}
                    contents={{
                      langId: '',
                      ...item.contents,
                      url: UrlUtil.createHref({
                        url: url,
                        targetPath: EndPoints.BLOG_WITH.URL(item.contents?.url),
                      }),
                    }}
                  />
                ))}
              </ul>
            </div>
            <div className="col-6 col-lg-2 mt-3 mt-md-0">
              <h4>{componentElementContents('hitBlogsTitle')?.content}</h4>
              <ul>
                {props.component.customData?.hitBlogs?.map((item) => (
                  <Navigation
                    key={`hit-blog-item-${item._id}`}
                    {...item}
                    contents={{
                      langId: '',
                      ...item.contents,
                      url: UrlUtil.createHref({
                        url: url,
                        targetPath: EndPoints.BLOG_WITH.URL(item.contents?.url),
                      }),
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="text-start mt-3">
            <small className="fw-bold">
              {componentElementContents('languagesTitle')?.content}:
            </small>
            <span>
              {appState.languages.map((language, index) => (
                <Language
                  key={`footer-language-item-${language._id}`}
                  {...language}
                />
              ))}
            </span>
          </div>
          <div className="text-center mt-3">
            <small>
              © {appState.settings.seoContents?.title}{' '}
              {new Date().getStringWithMask('yyyy')}. All rights reserved.
            </small>
          </div>
        </div>
      </footer>
    );
  });

ComponentThemeFooter.componentServerSideProps = async (
  store,
  req,
  component
) => {
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

export default ComponentThemeFooter;
