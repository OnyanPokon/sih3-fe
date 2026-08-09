import { useAuth, useNotification } from '@/hooks';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, isLoading } = useAuth();
  const { error } = useNotification();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoadingSSO, setIsLoadingSSO] = useState(false);

  /**
   * @param {{
   *   email: string;
   *   password: string;
   *   remember: boolean;
   * }} values
   */
  const onFinish = async (values) => {
    const { isSuccess, message } = await login(values.email, values.password);
    if (!isSuccess) return error('Gagal', message);
  };

  const handleLoginSSO = async () => {
    try {
      setIsLoadingSSO(true);
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_CLIENT_ID_SSO,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        response_type: 'code',
        scope: '',
        state: 'xyz'
      });
      const ssoUrl = import.meta.env.VITE_SSO_URL;
      window.location.href = `${ssoUrl}oauth/authorize?${params.toString()}`;
    } catch (err) {
      error(err?.response?.data?.message || err.message || 'Gagal melakukan login.');
    } finally {
      setIsLoadingSSO(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-5 mt-4 flex w-full flex-col items-center justify-center gap-y-2">
          <div className="mb-4 flex flex-col items-center justify-center gap-y-2 text-center">
            <h1 className="text-3xl font-semibold">Selamat Datang</h1>
            <p className="max-w-sm text-xs">Masukan kredensial untuk mengakses halaman dashboard</p>
          </div>
        </div>
        <Form className="w-full max-w-sm" name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            className="m-0 mb-3"
            rules={[
              {
                required: true,
                message: 'Mohon masukkan email!'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item label="Kata Sandi">
            <Form.Item
              name="password"
              className="m-0"
              rules={[
                {
                  required: true,
                  message: 'Mohon masukkan kata sandi!'
                }
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Kata Sandi"
                size="large"
                suffix={passwordVisible ? <EyeOutlined onClick={() => setPasswordVisible(false)} /> : <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} />}
              />
            </Form.Item>
            <Form.Item className="m-0 mt-2">
              <Link className="text-blue-500" to="/auth/forget_password">
                Lupa Password ?
              </Link>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button block loading={isLoading} type="primary" htmlType="submit" size="large" className="mb-2">
              Masuk
            </Button>
            <Button block size="large" icon={<img src="/image_asset/logo/sso_symbol_colored_logo.png" className="h-[18px] w-4" />} onClick={handleLoginSSO} loading={isLoadingSSO}>
              Masuk Dengan SSO
            </Button>
          </Form.Item>
          <Form.Item>
            <span className="m-0 block text-center">
              Bukan admin? Silahkan{' '}
              <Link className="text-color-primary-500 hover:text-color-primary-200 font-bold underline" to="/">
                Kembali ke beranda
              </Link>
            </span>
          </Form.Item>
        </Form>
      </div>
      <div className="h-full w-full p-4">
        <div
          style={{
            backgroundImage: "url('/image_asset/background/hero_bg.jpg')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backgroundBlendMode: 'multiply'
          }}
          className="flex h-full w-full flex-col justify-end gap-y-2 rounded-xl p-12"
        >
          <Typography.Title className="" level={2} style={{ margin: 0, color: '#fff' }}>
            Presisi Data, Masa Depan Gorontalo
          </Typography.Title>
          <p className="mb-6 max-w-lg text-sm text-white">Platform digital terintegrasi untuk pengelolaan data sumber daya air yang presisi, mendukung keberlanjutan ekosistem di wilayah Gorontalo.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
