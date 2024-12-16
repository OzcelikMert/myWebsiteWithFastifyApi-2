import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class SitemapsEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.BLOG) {
    this.mainPath = mainPath;
  }

  POST(typeName?: string, page?: number) {
    return PathUtil.createPath(
      this.mainPath,
      `/post/${typeName ?? ':typeName'}`,
      `/${page ?? ':page'}`
    );
  }
}
