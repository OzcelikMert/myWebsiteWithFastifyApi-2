import React from 'react';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { NavDropdown } from 'react-bootstrap';
import { UrlUtil } from '@utils/url.util';
import { useAppSelector } from '@redux/hooks';

type IComponentProps = {
  item: INavigationGetResultService;
  index: number;
};

const ComponentThemeNavbarDropdownItem = React.memo(
  (props: IComponentProps) => {
    const appState = useAppSelector((state) => state.appState);

    return (
      <NavDropdown.Item
        href={UrlUtil.createHref({
          url: appState.url,
          targetPath: props.item.contents?.url,
        })}
      >
        {props.item.contents?.title}
      </NavDropdown.Item>
    );
  }
);

export default ComponentThemeNavbarDropdownItem;
