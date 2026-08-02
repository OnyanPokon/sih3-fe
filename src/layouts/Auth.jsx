import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!token) return;

    if (redirect && !redirect.includes('/auth')) {
      navigate(redirect);
    } else {
      navigate('/dashboard');
    }
  }, [navigate, redirect, token]);

  return (
    <section className="w-full bg-white">
      <Outlet />
    </section>
  );
};

export default Auth;
