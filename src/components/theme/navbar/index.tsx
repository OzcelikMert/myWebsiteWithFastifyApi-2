import React, { useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { NavigationService } from '@services/navigation.service';
import { StatusId } from '@constants/status';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { Nav, Navbar } from 'react-bootstrap';
import { UrlUtil } from '@utils/url.util';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { useAppSelector } from '@redux/hooks';
import { HelperUtil } from '@utils/helper.util';
import { useEffectAfterDidMount } from '@library/react/hooks';
import ComponentThemeNavbarDropdown from './dropdown';
import ComponentThemeNavbarNavItem from './navItem';

const LoginButton = React.memo((props: { title: string }) => {
  return (
    <a className="btn btn-warning login-btn" href="http://localhost:3001/login">
      {props.title}
    </a>
  );
});

type IComponentState = {
  isSticky: boolean;
  activeItems: { [key: string]: any };
};

const initialState: IComponentState = {
  activeItems: {},
  isSticky: false,
};

type IComponentProps = {
  component: IComponentGetResultService<{
    navigations?: INavigationGetResultService[];
  }>;
};

const ComponentThemeNavbar: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const appState = useAppSelector((state) => state.appState);

    const [isSticky, setIsSticky] = useState(initialState.isSticky);
    const [activeItems, setActiveItems] = useState(initialState.activeItems);

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    useEffectAfterDidMount(() => {
      setEvents();
      return () => removeEvents();
    }, [isSticky]);

    const setEvents = () => {
      window.addEventListener('scroll', onScrolling);
    };

    const removeEvents = () => {
      window.removeEventListener('scroll', onScrolling);
    };

    const checkIsActive = (_id: string) => {
      return Boolean(activeItems[_id]);
    };

    const onScrolling = () => {
      if (window.scrollY > window.frames.innerHeight) {
        if (!isSticky) {
          setIsSticky(true);
        }
      } else {
        if (isSticky) {
          setIsSticky(false);
        }
      }
    };

    const onToggleDropdown = (navigationId: string, isShow?: boolean) => {
      setActiveItems((state) => ({
        ...state,
        [navigationId]:
          typeof isShow !== 'undefined'
            ? isShow
            : typeof state[navigationId] !== 'undefined'
              ? !state[navigationId]
              : true,
      }));
    };

    const navigations = props.component.customData?.navigations ?? [];

    return (
      <div
        className={`navbar-section ${isSticky ? 'scroll-on' : 'start-style'}`}
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
                {navigations.map((item, index) => {
                  if (item.parentId) {
                    return null;
                  }

                  const children =
                    navigations.findMulti('parentId', item._id) ?? [];

                  if (children.length > 0) {
                    return (
                      <ComponentThemeNavbarDropdown
                        key={`navbar-dropdown-${item._id}`}
                        item={item}
                        index={index}
                        items={navigations.filter(
                          (nav) => nav.parentId != item._id
                        )}
                        children={children}
                        checkIsActive={(_id) => checkIsActive(_id)}
                        onToggleDropdown={(_id, status) =>
                          onToggleDropdown(_id, status)
                        }
                      />
                    );
                  }

                  return (
                    <ComponentThemeNavbarNavItem
                      key={`navbar-item-${item._id}`}
                      item={item}
                      index={index}
                    />
                  );
                })}
              </Nav>
              <LoginButton
                title={componentElementContents('buttonText')?.content ?? ''}
              />
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  });

ComponentThemeNavbar.componentServerSideProps = async (
  store,
  req,
  component
) => {
  component.customData = {};

  const { appState } = store.getState();

  component.customData.navigations =
    (
      await NavigationService.getMany(
        {
          langId: appState.selectedLangId,
          statusId: StatusId.Active,
          isPrimary: true,
        },
        req.abortController.signal
      )
    ).data ?? [];
};

export default ComponentThemeNavbar;
