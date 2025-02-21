import React from 'react';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { Nav } from 'react-bootstrap';
import { UrlUtil } from '@utils/url.util';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  item: INavigationGetResultService;
  index: number;
};

const ComponentThemeNavbarNavItem = React.memo((props: IComponentProps) => {
  const appState = useAppSelector((state) => state.appState);

  return (
    <Nav.Item>
      <Nav.Link
        href={UrlUtil.createHref({
          url: appState.url,
          targetPath: props.item.contents?.url,
        })}
      >
        {props.item.contents?.title}
      </Nav.Link>
    </Nav.Item>
  );
});

export default ComponentThemeNavbarNavItem;
