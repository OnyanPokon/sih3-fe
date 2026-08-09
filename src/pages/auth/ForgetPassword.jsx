import { useNotification, useService } from '@/hooks';
import { AuthService } from '@/services';
import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [sended, setsended] = React.useState(false);
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const sendEmailForgot = useService(AuthService.sendEmailForgot);

  const onFinish = async (values) => {
    const { message, isSuccess } = await sendEmailForgot.execute(values.email);
    if (isSuccess) {
      success('Berhasil', message);
      setsended(true);
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  return (
    <>
      {!sended && (
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl items-center justify-center py-28">
          <Card>
            <div className="flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-x-2">
                <h1 className="text-lg font-semibold">Lupa Password</h1>
              </div>
              <hr className="my-4 w-full" />
              <div className="mb-10 flex flex-col items-center justify-center gap-y-2 text-center">
                <p className="max-w-xs text-xs">Jika kamu lupa kata sandi, silahkan masukan email di bawah untuk melakukan pemulihan akun .</p>
              </div>
              <Form className="w-full max-w-sm" name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
                <Form.Item
                  label="Email"
                  name="email"
                  className="mb-2"
                  rules={[
                    {
                      required: true,
                      message: 'Mohon masukkan email!'
                    }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="contoh@domain.com" size="large" />
                </Form.Item>
                <small className="text-gray-500">Email yang terdaftar dalam sistem SIH3</small>
                <Form.Item className="mt-6">
                  <Button loading={sendEmailForgot.isLoading} block type="primary" htmlType="submit" size="large" className="mb-2">
                    Lanjutkan
                  </Button>
                  <Divider plain>
                    <div className="text-gray-500">Atau</div>
                  </Divider>
                  <Button block size="small" variant="link" color="primary" onClick={() => navigate('/auth/login')}>
                    Kembali Ke Halaman Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      )}
      {sended && (
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl items-center justify-center py-28">
          <Card>
            <Result
              status="success"
              title="Email Berhasil Dikirim!"
              subTitle="Silakan cek email Anda untuk instruksi selanjutnya."
              extra={[
                <Button type="primary" key="login" onClick={() => navigate('/auth/login')}>
                  Kembali Ke Halaman Login
                </Button>
              ]}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
