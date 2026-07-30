import { useAuth, useNotification, useService } from '@/hooks';
import { AuthService, PersonilsService } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Skeleton, Tabs } from 'antd';
import React, { useEffect, useMemo } from 'react';

const Settings = () => {
  const { token, user, logout } = useAuth();
  const { success, error } = useNotification();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { execute: fetchPersonilData, ...getAllPersonilData } = useService(PersonilsService.getById);

  useEffect(() => {
    if (user?.id) {
      fetchPersonilData(user.id, token);
    }
  }, [fetchPersonilData, token, user]);

  const personil = useMemo(() => getAllPersonilData.data ?? {}, [getAllPersonilData.data]);
  const updatePassword = useService(AuthService.changePassword);

  useEffect(() => {
    profileForm.setFieldsValue({
      name: personil?.name || user?.name || '',
      unor: personil?.unor_id?.name || user?.unor?.nama || '',
      email: personil?.user_id?.email || user?.email || ''
    });
  }, [personil, user, profileForm]);

  const onSubmitChangePassword = async (values) => {
    const { message, isSuccess } = await updatePassword.execute(token, values);
    if (isSuccess) {
      success('Berhasil', message || 'Berhasil mengganti password');
      passwordForm.resetFields();
      logout();
    } else {
      error('Gagal', message || 'Gagal mengganti password');
    }
  };

  const tabItems = [
    {
      key: 'profil',
      label: (
        <span className="flex items-center gap-2 font-medium">
          <UserOutlined />
          Profil
        </span>
      ),
      children: (
        <Form form={profileForm} layout="vertical" className="max-w-2xl py-2">
          <Form.Item label="Nama" name="name">
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item label="Unor" name="unor">
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input size="large" disabled />
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'password',
      label: (
        <span className="flex items-center gap-2 font-medium">
          <LockOutlined />
          Ubah Password
        </span>
      ),
      children: (
        <Form form={passwordForm} layout="vertical" onFinish={onSubmitChangePassword} className="max-w-2xl py-2">
          <Form.Item
            label="Password Lama"
            name="old_password"
            rules={[
              { required: true, message: 'Password lama harus diisi' },
            ]}
          >
            <Input.Password size="large" placeholder="Masukkan password lama" />
          </Form.Item>
          <Form.Item
            label="Password Baru"
            name="new_password"
            rules={[
              { required: true, message: 'Password baru harus diisi' },
              { min: 8, message: 'Password baru minimal 8 karakter' }
            ]}
          >
            <Input.Password size="large" placeholder="Masukkan password baru" />
          </Form.Item>
          <Form.Item
            label="Konfirmasi Password Baru"
            name="confirm_password"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Konfirmasi password baru harus diisi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Konfirmasi password baru harus sama dengan password baru'));
                }
              })
            ]}
          >
            <Input.Password size="large" placeholder="Ulangi password baru" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={updatePassword.isLoading}>
              Simpan
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="w-full">
      {getAllPersonilData.isLoading ? (
        <Card className="w-full shadow-sm">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : (
        <Card title="Pengaturan" className="w-full shadow-sm">
          <Tabs defaultActiveKey="profil" items={tabItems} />
        </Card>
      )}
    </div>
  );
};

export default Settings;
