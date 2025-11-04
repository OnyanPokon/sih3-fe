import { Footer, Navbar } from '@/components';
import { Outlet, useLocation } from 'react-router-dom';

const Landing = () => {
  const location = useLocation(); // ✅ ini yang bikin reactive
  const isMapPage = location.pathname === '/pemetaan'; // cek path aktif
  return (
    <div className="flex h-dvh flex-col font-sans">
      {!isMapPage && <Navbar />}

      <main className="flex-auto bg-white">
        <Outlet />
        {!isMapPage && <Footer />}
      </main>
    </div>
  );
};

export default Landing;
