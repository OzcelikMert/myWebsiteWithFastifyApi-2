import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class BlogEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.BLOG) {
    this.mainPath = mainPath;
  }

  URL(url?: string) {
    return PathUtil.createPath(this.mainPath, `/${url ?? ':url'}`);
  }
}
