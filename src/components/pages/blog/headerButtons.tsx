import React from 'react';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { UrlUtil } from '@utils/url.util';
import { EndPoints } from '@constants/endPoints';
import { DateMask } from '@library/variable/date';
import { IPostGetPrevNextResultService } from 'types/services/post.service';

type IComponentProps = {
  views: number;
  onClickShare: () => void;
};

const ComponentPageBlogHeaderButtons = React.memo((props: IComponentProps) => {
  return (
    <div className="align-center fs-5">
      <span className="text-light mt-1 mx-4">
        {props.views || 1} <i className="text-primary mdi mdi-eye fs-4"></i>
      </span>
      <span
        className="text-light mt-1 mx-4"
        role="button"
        onClick={() => props.onClickShare()}
      >
        <i className="text-warning mdi mdi-share-variant fs-4"></i>
      </span>
    </div>
  );
});

export default ComponentPageBlogHeaderButtons;
