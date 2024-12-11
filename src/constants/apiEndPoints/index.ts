import { UserApiEndPoint } from '@constants/apiEndPoints/user.api.endPoint';
import { PostApiEndPoint } from '@constants/apiEndPoints/post.api.endPoint';
import { PostTermApiEndPoint } from '@constants/apiEndPoints/postTerm.api.endPoint';
import { SettingApiEndPoint } from '@constants/apiEndPoints/setting.api.endPoint';
import { LanguageApiEndPoint } from '@constants/apiEndPoints/language.api.endPoint';
import { MailerApiEndPoint } from '@constants/apiEndPoints/mailer.api.endPoint';
import { SubscriberApiEndPoint } from '@constants/apiEndPoints/subscriber.api.endPoint';
import { SitemapApiEndPoint } from '@constants/apiEndPoints/sitemap.api.endPoint';
import { NavigationApiEndPoint } from '@constants/apiEndPoints/navigation.api.endPoint';
import { ComponentApiEndPoint } from '@constants/apiEndPoints/component.api.endPoint';

export class ApiEndPoints {
  static get USER() {
    return '/user';
  }
  static get USER_WITH() {
    return new UserApiEndPoint();
  }

  static get POST() {
    return '/post';
  }
  static get POST_WITH() {
    return new PostApiEndPoint();
  }

  static get POST_TERM() {
    return '/post-term';
  }
  static get POST_TERM_WITH() {
    return new PostTermApiEndPoint();
  }

  static get SETTING() {
    return '/setting';
  }
  static get SETTING_WITH() {
    return new SettingApiEndPoint();
  }

  static get LANGUAGE() {
    return '/language';
  }
  static get LANGUAGE_WITH() {
    return new LanguageApiEndPoint();
  }

  static get MAILER() {
    return '/mailer';
  }
  static get MAILER_WITH() {
    return new MailerApiEndPoint();
  }

  static get SUBSCRIBER() {
    return '/subscriber';
  }
  static get SUBSCRIBER_WITH() {
    return new SubscriberApiEndPoint();
  }

  static get SITEMAP() {
    return '/sitemap';
  }
  static get SITEMAP_WITH() {
    return new SitemapApiEndPoint();
  }

  static get NAVIGATION() {
    return '/navigation';
  }
  static get NAVIGATION_WITH() {
    return new NavigationApiEndPoint();
  }

  static get COMPONENT() {
    return '/component';
  }
  static get COMPONENT_WITH() {
    return new ComponentApiEndPoint();
  }
}
