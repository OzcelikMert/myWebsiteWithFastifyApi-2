import React from 'react';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  item: IPostTermGetResultService;
  index?: number;
  isSelected?: boolean;
  onMouseOver?: (item: IPostTermGetResultService) => void;
};

const ComponentCategory = React.memo((props: IComponentProps) => {
  const url = useAppSelector((state) => state.appState.url);

  const onMouseOver = () => {
    if (props.onMouseOver) {
      props.onMouseOver(props.item);
    }
  };

  const categoryURL = UrlUtil.createHref({
    url: url,
    targetPath: EndPoints.BLOGS_WITH.CATEGORY(props.item.contents?.url),
  });

  return (
    <div
      className={`option ${props.isSelected ? 'active' : ''}`}
      onMouseOver={(event) => onMouseOver()}
    >
      <a href={categoryURL}>
        <div
          className="bg-img"
          style={{
            backgroundImage: `url(${ImageSourceUtil.getUploadedImageSrc(props.item.contents?.image)})`,
          }}
        ></div>
        <div className="label-shadow"></div>
        <div className="label">
          <div className="icon">
            <i className="mdi mdi-walk"></i>
          </div>
          <div className="info">
            <h2 className="main">{props.item.contents?.title}</h2>
          </div>
        </div>
      </a>
    </div>
  );
});

export default ComponentCategory;
