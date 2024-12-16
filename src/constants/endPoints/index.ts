import { BlogsEndPoint } from '@constants/endPoints/blogs.endPoint';
import { BlogEndPoint } from '@constants/endPoints/blog.endPoint';
import { SitemapsEndPoint } from '@constants/endPoints/sitemaps.endPoint';

export class EndPoints {
  static get HOME() {
    return '/';
  }

  static PAGE(url?: string) {
    return `/${url ?? ':url'}`;
  }

  static get BLOG() {
    return '/blog';
  }
  static get BLOG_WITH() {
    return new BlogEndPoint();
  }

  static get BLOGS() {
    return '/blogs';
  }
  static get BLOGS_WITH() {
    return new BlogsEndPoint();
  }

  static get SITEMAP() {
    return '/sitemaps.xml';
  }

  static get SITEMAPS() {
    return '/blog';
  }
  static get SITEMAPS_WITH() {
    return new SitemapsEndPoint();
  }
}
