import { Footer, Navbar } from '@/components';
import { Outlet, useLocation } from 'react-router-dom';

const Landing = () => {
  const location = useLocation(); // ✅ ini yang bikin reactive
  const isMapPage = location.pathname === '/pemetaan'; // cek path aktif
  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="fixed left-0 right-0 top-0 z-[999] border border-slate-300 bg-white">{!isMapPage && <Navbar />}</header>

      <main className="flex-auto bg-white">
        <Outlet />
        {!isMapPage && <Footer />}
      </main>
    </div>
  );
};

export default Landing;
