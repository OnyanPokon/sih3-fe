import { useAuth, useNotification } from '@/hooks';
import { Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const { ssoCallback } = useAuth();
  const navigate = useNavigate();
  const { error, success } = useNotification();
  const code = searchParams.get('code');
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!code) {
      navigate('/auth/login', { replace: true });
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    const processCallback = async () => {
      const { isSuccess, message } = await ssoCallback(code);
      if (!isSuccess) {
        error('Login Gagal', message || 'Terjadi kesalahan saat verifikasi SSO');
        navigate('/auth/login', { replace: true });
      } else {
        success('Berhasil', 'Login SSO berhasil');
        navigate('/dashboard');
      }
    };

    processCallback();
  }, [code, error, navigate, ssoCallback, success]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 py-20">
      <Spin size="large" />
      <span className="text-gray-500">Memproses autentikasi SSO...</span>
    </div>
  );
};

export default Callback;
