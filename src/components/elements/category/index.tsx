import React from 'react';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@lib/hooks';

type IComponentProps = {
  item: IPostTermGetResultService;
  index?: number;
  isSelected?: boolean;
  onMouseOver?: (item: IPostTermGetResultService) => void;
};

export default function ComponentCategory({
  item,
  index,
  isSelected,
  onMouseOver,
}: IComponentProps) {
  const url = useAppSelector((state) => state.appState.url);

  const handleMouseOver = () => {
    if (onMouseOver) {
      onMouseOver(item);
    }
  };

  const categoryURL = UrlUtil.createHref({
    url: url,
    targetPath: EndPoints.BLOGS_WITH.CATEGORY(item.contents?.url),
  });
  return (
    <div
      key={`category_${item._id}`}
      className={`option ${isSelected ? 'active' : ''}`}
      onMouseOver={(event) => handleMouseOver()}
    >
      <a href={categoryURL}>
        <div
          className="bg-img"
          style={{
            backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(item.contents?.image)})`,
          }}
        ></div>
        <div className="label-shadow"></div>
        <div className="label">
          <div className="icon">
            <i className="mdi mdi-walk"></i>
          </div>
          <div className="info">
            <h2 className="main">{item.contents?.title}</h2>
          </div>
        </div>
      </a>
    </div>
  );
}
