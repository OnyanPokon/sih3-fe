import { useAuth, useNotification } from '@/hooks';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
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
        response_type: "code",
        scope: "",
        state: "xyz"
      });
      const ssoUrl = import.meta.env.VITE_SSO_URL;
      window.location.href = `${ssoUrl}oauth/authorize?${params.toString()}`;

    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Gagal melakukan login.");
    } finally {
      setIsLoadingSSO(false);
    }
  }

  return (
    <Card className="w-full max-w-md px-4">
      <div className="mb-5 mt-4 flex w-full flex-col items-center justify-center gap-y-2">
        <div className="mb-4 flex flex-col items-center justify-center gap-y-2 text-center">
          <h1 className="text-xl font-semibold">Selamat Datang!</h1>
          <p className="max-w-xs text-xs">Sistem Informasi berbasis website untuk memenuhi kebutuhan pengelolaan manajemen</p>
        </div>
      </div>
      <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Mohon masukkan username!'
            }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
        </Form.Item>
        <Form.Item label="Kata Sandi">
          <Form.Item
            name="password"
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
    </Card>
  );
};

export default Login;
