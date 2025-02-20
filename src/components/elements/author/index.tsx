import React from 'react';
import { IUserGetResultService } from 'types/services/user.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IComponentWithServerSideProps } from 'types/components/ssr';

type IComponentProps = {
  item: IUserGetResultService;
  index: number;
};

const ComponentAuthor: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    return (
      <div className="card-wrapper">
        <div className="card">
          <div className="card-image">
            <Image
              className="img-fluid"
              src={ImageSourceUtil.getUploadedImageSrc(props.item.image)}
              alt={props.item.name}
              fill
            />
          </div>
          <ul className="social-icons">
            <li>
              <a href={props.item.facebook ?? '#'}>
                <i className="mdi mdi-facebook"></i>
              </a>
            </li>
            <li>
              <a href={props.item.instagram ?? '#'}>
                <i className="mdi mdi-instagram"></i>
              </a>
            </li>
            <li>
              <a href={props.item.twitter ?? '#'}>
                <i className="mdi mdi-twitter"></i>
              </a>
            </li>
            <li>
              <a href={props.item.email ? `mailto:${props.item.email}` : '#'}>
                <i className="mdi mdi-email"></i>
              </a>
            </li>
          </ul>
          <div className="details">
            <h2>
              {props.item.name}
              <br />
              <span className="job-title">{props.item.comment}</span>
            </h2>
          </div>
        </div>
      </div>
    );
  });

export default ComponentAuthor;
