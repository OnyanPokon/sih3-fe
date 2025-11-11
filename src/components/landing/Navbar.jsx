import { landingLink } from '@/data/link';
import { findItemByKey } from '@/utils/landingLink';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Grid, Image, Menu, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const breakpoints = Grid.useBreakpoint();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleMenuClick = (e) => {
    const clickedItem = findItemByKey(landingLink, e.key);
    if (clickedItem) {
      navigate(clickedItem.key);
    }
  };

  const loadingData = false;
  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-[999] transition-all duration-300 ${isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-white'}`}>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 p-4">
        <div className="flex w-fit items-center gap-x-4 lg:w-full">
          {isDesktop ? (
            <>
              {loadingData ? (
                <div className="inline-flex items-center gap-x-2">
                  <Skeleton.Button size="large" active />
                  <Skeleton.Input size="small" active />
                </div>
              ) : (
                <>
                  <Image width={40} preview={false} src={''} />
                  <b>
                    <span className={`transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-white'}`}>SIH3</span>
                  </b>
                </>
              )}
              <Menu
                style={{
                  minWidth: 0,
                  flex: 'auto',
                  border: 'none',
                  background: 'transparent'
                }}
                mode="horizontal"
                items={landingLink}
                activeKey=""
                onClick={handleMenuClick}
                className={`transition-colors duration-300 ${
                  isScrolled ? '[&_.ant-menu-item]:!text-black [&_.ant-menu-submenu-title]:!text-black' : '[&_.ant-menu-item]:!text-white [&_.ant-menu-submenu-title]:!text-white'
                } [&_.ant-menu-item-selected]:!text-blue-500 [&_.ant-menu-item]:!bg-transparent [&_.ant-menu-submenu-title]:!bg-transparent`}
              />
            </>
          ) : (
            <>
              <Button icon={<MenuOutlined />} onClick={openDrawer} />
              <Drawer open={isDrawerOpen} onClose={closeDrawer} placement="left" width={300}>
                <Menu items={landingLink} mode="inline" onClick={handleMenuClick} />
              </Drawer>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-x-4">
          <Button variant="solid" color="primary" icon={<UserOutlined />} shape="round" onClick={() => navigate('/auth/login')}>
            Masuk
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
