import Parser from 'xml2js';
import { SitemapService } from '@services/sitemap.service';
import { ISitemapFileIndex } from 'types/pages/sitemap.xml';
import { PostUtil } from '@utils/post.util';
import { SitemapUtil } from '@utils/sitemap.util';
import { wrapper } from '@lib/store';

export default function PageSitemapXML() {
  return null;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const res = context.res;
    const req = context.req;

    const url = store.getState().appState.url;

    const serviceResult = await SitemapService.getMaps();

    if (serviceResult.status && serviceResult.data) {
      const sitemapData: ISitemapFileIndex = {
        sitemapindex: {
          sitemap: [],
          $: {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          },
        },
      };

      for (const post of serviceResult.data.post) {
        const pages = Math.ceil(post.total / 500);
        const typeName = PostUtil.getTypeName(post.typeId);
        for (let i = 0; i < pages; i++) {
          sitemapData.sitemapindex.sitemap.push({
            loc: SitemapUtil.getLoc(
              url.base,
              'sitemaps',
              'post',
              typeName,
              (i + 1).toString()
            ),
          });
        }
      }

      const xml = new Parser.Builder().buildObject(sitemapData);
      res.setHeader('Content-Type', 'text/xml');
      res.write(xml);
      res.end();
    }

    return {
      props: {},
    };
  }
);
