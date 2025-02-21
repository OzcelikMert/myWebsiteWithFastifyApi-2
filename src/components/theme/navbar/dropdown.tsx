import React from 'react';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { NavDropdown } from 'react-bootstrap';
import ComponentThemeNavbarDropdownItem from './dropdownItem';

type IComponentProps = {
  item: INavigationGetResultService;
  index: number;
  items: INavigationGetResultService[];
  children: INavigationGetResultService[];
  checkIsActive: (_id: string) => boolean;
  onToggleDropdown: (_id: string, status?: boolean) => void;
};

const ComponentThemeNavbarDropdown = React.memo((props: IComponentProps) => {
  return (
    <NavDropdown
      renderMenuOnMount={true}
      show={props.checkIsActive(props.item._id)}
      title={props.item.contents?.title}
      drop={props.item.parentId ? 'end' : 'down'}
      onMouseEnter={(event) => props.onToggleDropdown(props.item._id, true)}
      onMouseLeave={(event) => props.onToggleDropdown(props.item._id, false)}
      onClick={(event) => props.onToggleDropdown(props.item._id)}
    >
      {props.children.map((child, childIndex) => {
        const children = props.items.findMulti('parentId', child._id) ?? [];

        if (children.length > 0) {
          return (
            <ComponentThemeNavbarDropdown
              {...props}
              items={props.items.filter((nav) => nav.parentId != child._id)}
              key={`navbar-dropdown-${child._id}`}
              children={children}
              item={child}
              index={childIndex}
            />
          );
        }

        return (
          <ComponentThemeNavbarDropdownItem
            key={`navbar-dropdown-item-${child._id}`}
            item={child}
            index={childIndex}
          />
        );
      })}
    </NavDropdown>
  );
});

export default ComponentThemeNavbarDropdown;
