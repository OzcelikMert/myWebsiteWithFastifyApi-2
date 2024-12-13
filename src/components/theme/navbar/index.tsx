import React, { useEffect, useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { NavigationService } from '@services/navigation.service';
import { StatusId } from '@constants/status';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { UrlUtil } from '@utils/url.util';
import { IFuncComponentServerSideProps } from 'types/components/ssr';
import { useAppSelector } from '@lib/hooks';
import { HelperUtil } from '@utils/helper.util';

type IComponentState = {
  isNavbarSticky: boolean;
  navbarStatus: { [key: string]: any }
};

type IComponentProps = {
  component: IComponentGetResultService<{
    navigations?: INavigationGetResultService[];
  }>;
};

function ComponentThemeNavbar({component}: IComponentProps) {
  const [isNavbarSticky, setIsNavbarSticky] = useState<IComponentState["isNavbarSticky"]>(false);
  const [navbarStatus, setNavbarStatus] = useState<IComponentState["navbarStatus"]>({});
  const { appState } = useAppSelector(state => state);

  useEffect(() => {
    setEvents();
  })

  const setEvents = () => {
    window.addEventListener('scroll', () => onScrolling());
  }

  const onScrolling = () => {
    if (window.scrollY > window.frames.innerHeight) {
      if (!isNavbarSticky) {
        setIsNavbarSticky(true);
      }
    } else {
      if (isNavbarSticky) {
        setIsNavbarSticky(false);
      }
    }
  }

  const onShowDropdown = (navigationId: string, isShow: boolean) => {
    setNavbarStatus({[navigationId]: isShow})
  };

  const DropdownItem = (props: INavigationGetResultService, index: number) => {
    const children =
      component.customData?.navigations?.findMulti(
        'parentId._id',
        props._id
      ) ?? [];

    return children.length > 0 ? (
      Dropdown(props, index)
    ) : (
      <NavDropdown.Item
        key={props._id}
        href={UrlUtil.createHref({
          url: appState.url,
          targetPath: props.contents?.url,
        })}
      >
        {props.contents?.title}
      </NavDropdown.Item>
    );
  };

  const Dropdown = (props: INavigationGetResultService, index: number) => {
    const children =
      component.customData?.navigations?.findMulti(
        'parentId._id',
        props._id
      ) ?? [];

    return (
      <NavDropdown
        renderMenuOnMount={true}
        show={navbarStatus[props._id]}
        key={props._id}
        title={props.contents?.title}
        drop={props.parentId ? 'end' : 'down'}
        onMouseEnter={(event) => onShowDropdown(props._id, true)}
        onMouseLeave={(event) => onShowDropdown(props._id, false)}
        onClick={(event) =>
          onShowDropdown(props._id, !navbarStatus[props._id])
        }
      >
        {children.map((child, childIndex) =>
          DropdownItem(child, childIndex)
        )}
      </NavDropdown>
    );
  };

  const NavItem = (props: INavigationGetResultService, index: number) => {
    if (props.parentId) return null;
    const children =
      component.customData?.navigations?.findMulti(
        'parentId._id',
        props._id
      ) ?? [];

    return children.length > 0 ? (
      Dropdown(props, index)
    ) : (
      <Nav.Item key={props._id}>
        <Nav.Link
          href={UrlUtil.createHref({
            url: appState.url,
            targetPath: props.contents?.url,
          })}
        >
          {props.contents?.title}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <div
      className={`navbar-section ${isNavbarSticky ? 'scroll-on' : 'start-style'}`}
      id="navbar-section"
    >
      <div className="container">
        <Navbar expand="md" className="navbar-light">
          <Navbar.Brand
            href={UrlUtil.createHref({
              url: appState.url,
              targetPath: '',
            })}
          >
            <h2>{appState.settings.seoContents?.title}</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="#nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="nav">
            <Nav>
              {component.customData?.navigations?.map(
                (navigation, index) => NavItem(navigation, index)
              )}
            </Nav>
            <a
              className="btn btn-warning login-btn"
              href="http://localhost:3001/login"
            >
              {HelperUtil.getComponentElementContents(component, 'buttonText')?.content}
            </a>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

const componentServerSideProps: IFuncComponentServerSideProps = async (store, req, component) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.navigations =
    (
      await NavigationService.getMany({
        langId: appState.selectedLangId,
        statusId: StatusId.Active,
        isPrimary: true,
      })
    ).data ?? [];
};

ComponentThemeNavbar.componentServerSideProps = componentServerSideProps;

export default ComponentThemeNavbar;
