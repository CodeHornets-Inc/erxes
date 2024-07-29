import * as React from 'react';
import { IconChevronLeft } from '../../../../icons/Icons';
import BottomNavBar from '../../BottomNavBar';
import { useRouter } from '../../../context/Router';

type Props = {
  withTopBar?: boolean;
  title?: string | React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  withBottomNavBar?: boolean;
  containerStyle?: React.CSSProperties;
  backRoute?: string;
  persistentFooter?: React.ReactNode;
  onBackButton?: () => void;
};

const Container: React.FC<Props> = ({
  children,
  title,
  extra,
  withTopBar = false,
  withBottomNavBar = true,
  containerStyle,
  backRoute,
  persistentFooter,
  onBackButton,
}) => {
  const { setActiveRoute } = useRouter();

  const handleBackClick = () => {
    if (onBackButton) {
      onBackButton();
      return;
    }
    if (backRoute) {
      setActiveRoute(backRoute);
      return;
    }
    setActiveRoute('home');
  };

  return (
    <div className="container">
      {(withTopBar || title) && (
        <div className="top-nav-container">
          <div className="top-nav" style={containerStyle}>
            <div className="icon" onClick={handleBackClick}>
              <IconChevronLeft />
            </div>
            {typeof title === 'string' ? (
              <div className="title">{title}</div>
            ) : (
              title
            )}
          </div>
          {extra && <div className="extra-content">{extra}</div>}
        </div>
      )}
      <div className="container-content">{children}</div>
      {persistentFooter && (
        <div className="persistent-footer">{persistentFooter}</div>
      )}
      {withBottomNavBar && <BottomNavBar />}
    </div>
  );
};

export default Container;
