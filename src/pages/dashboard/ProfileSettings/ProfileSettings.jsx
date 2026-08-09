import { DataLoader } from '@/components';
import { Action } from '@/constants';
import { useAuth, useNotification, useService } from '@/hooks';
import { Profiles as ProfileModel } from '@/models';
import { AuthService, PersonilsService, UnorsService } from '@/services';
import { IdcardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, Menu, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

const ProfileSettings = () => {
  const { token, user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = React.useState('profil');
  const { success, error } = useNotification();
  const [updateProfileForm] = Form.useForm();
  const [updateUnorForm] = Form.useForm();
  const { execute: fetchPersonilData, ...getAllPersonilData } = useService(PersonilsService.getById);

  React.useEffect(() => {
    if (user) {
      fetchPersonilData(user.id, token);
    }
  }, [fetchPersonilData, token, user]);

  const personil = React.useMemo(() => getAllPersonilData.data ?? {}, [getAllPersonilData.data]);

  const updatePersonil = useService(PersonilsService.updateProfile);
  const updateUnor = useService(UnorsService.updateUnorProfile);
  const udpatePersonilPassword = useService(AuthService.changePassword);

  React.useEffect(() => {
    if (personil) {
      updateProfileForm.setFieldsValue({
        name: personil?.name ?? '',
        nip: personil?.nip ?? '',
        position: personil?.position ?? '',
        phone_number: personil?.phone_number ?? '',
        email: personil?.user_id?.email ?? ''
      });
      updateUnorForm.setFieldsValue({
        name: personil?.unor_id?.name ?? '',
        region: personil?.unor_id?.region ?? '',
        address: personil?.unor_id?.address ?? ''
      });
    }
  }, [updateProfileForm, personil, updateUnorForm]);

  const onSubmitChangeProfile = async (values) => {
    const { message, isSuccess } = await updatePersonil.execute(user.id, values, token);
    if (isSuccess) {
      success('Berhasil', message);
    } else {
      error('Gagal', message);
    }
  };

  const onSubmitChangeUnor = async (values) => {
    const { message, isSuccess } = await updateUnor.execute(personil.unor_id.id, values, token);
    if (isSuccess) {
      success('Berhasil', message);
    } else {
      error('Gagal', message);
    }
  };

  const onSubmitChangePassword = async (values) => {
    const { message, isSuccess } = await udpatePersonilPassword.execute(token, values);
    if (isSuccess) {
      success('Berhasil', message);
      logout();
    } else {
      error('Gagal', message);
    }
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {getAllPersonilData.isLoading ? (
        <DataLoader type="profil" />
      ) : (
        <>
          <div className="col-span-12 flex w-full flex-col gap-y-4 lg:col-span-4">
            <Card className="w-full" cover={<img src="/image_asset/card_background.png" />}>
              <div className="relative px-4">
                <div className="absolute -top-16">
                  <Avatar shape="square" size={90} icon={<UserOutlined />} style={{ backgroundColor: '#fff', padding: '12px', color: 'black' }} className="shadow-md" />
                </div>
              </div>
              <div className="mt-12 px-4">
                <Typography.Title level={5}>{user?.name}</Typography.Title>
                <Typography.Text>{user?.role}</Typography.Text>
              </div>
            </Card>
            <Card className="w-full">
              <Menu onClick={(e) => setActiveMenu(e.key)} mode="vertical" defaultSelectedKeys={[activeMenu]}>
                <Menu.Item key="profil" icon={<UserOutlined />}>
                  Profil Pengguna
                </Menu.Item>
                <Menu.Item key="password" icon={<LockOutlined />}>
                  Ganti Password
                </Menu.Item>
                <Menu.Item key="unor" icon={<IdcardOutlined />}>
                  Unit Organisasi
                </Menu.Item>
              </Menu>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {activeMenu === 'profil' ? (
              <Card className="w-full" title="Profile Personil">
                <Form key="profil-form" layout="vertical" form={updateProfileForm} onFinish={onSubmitChangeProfile}>
                  <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Field Email harus diisi' },
                      { type: 'email', message: 'Format email tidak valid!' }
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="NIP" name="nip" rules={[{ required: true, message: 'Field NIP harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="Jabatan" name="position" rules={[{ required: true, message: 'Field Jabatan harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="No Handphone" name="phone_number" rules={[{ required: true, message: 'Field Nomor Handphone harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button disabled={!user?.eitherCan([Action.UPDATE, ProfileModel])} type="primary" htmlType="submit" loading={updatePersonil.isLoading}>
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : activeMenu === 'password' ? (
              <Card className="w-full" title="Ganti Kata Sandi">
                <Form key="profil-password" layout="vertical" onFinish={onSubmitChangePassword}>
                  <Form.Item label="Kata Sandi Lama" name="old_password" rules={[{ required: true, message: 'Password lama harus diisi' }]}>
                    <Input.Password placeholder="Masukan Password Lama" size="large" />
                  </Form.Item>
                  <Form.Item label="Kata Sandi Baru" name="new_password" rules={[{ required: true, message: 'Password baru harus diisi' }]}>
                    <Input.Password placeholder="Masukan Password Baru" size="large" />
                  </Form.Item>
                  <Form.Item label="Ulangi Kata Sandi Baru" name="confirm_password" rules={[{ required: true, message: 'Konfirmasi Password harus diisi' }]}>
                    <Input.Password placeholder="Ulangi Password Baru" size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button disabled={!user?.eitherCan([Action.UPDATE, ProfileModel])} type="primary" htmlType="submit" loading={udpatePersonilPassword.isLoading}>
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : activeMenu === 'unor' ? (
              <Card className="w-full" title="Profile Personil">
                <Form key="unor-form" layout="vertical" form={updateUnorForm} onFinish={onSubmitChangeUnor}>
                  <Form.Item label="Nama Unit Organisasi" name="name" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="Wilayah" name="region" rules={[{ required: true, message: 'Field Wilayah harus diisi' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="Alamat" name="address" rules={[{ required: true, message: 'Field Alamat harus diisi' }]}>
                    <TextArea size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button disabled={!user?.eitherCan([Action.UPDATE, ProfileModel])} type="primary" htmlType="submit" loading={updateUnor.isLoading}>
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
