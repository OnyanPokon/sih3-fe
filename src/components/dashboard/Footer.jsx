import { Footer as AntdFooter } from 'antd/es/layout/layout';

const Footer = () => {
  return (
    <AntdFooter style={{ textAlign: 'center' }}>
      SIH3 ©{new Date().getFullYear()} Created by <a href="https://instagram.com/msib7.kominfobpsdm">TKPSDA</a>
    </AntdFooter>
  );
};

export default Footer;
