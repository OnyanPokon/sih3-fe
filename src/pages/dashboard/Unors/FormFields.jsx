import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { PaperClipOutlined, PhoneOutlined } from '@ant-design/icons';

export const formFields = () => [
  {
    label: `Nama ${Modul.UNOR}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.UNOR} harus diisi`
      }
    ]
  },
  {
    label: `Wilayah ${Modul.UNOR}`,
    name: 'region',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Wilayah ${Modul.UNOR} harus diisi`
      }
    ]
  },
  {
    label: `Alamat ${Modul.UNOR}`,
    name: 'address',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Alamat ${Modul.UNOR} harus diisi`
      }
    ]
  },
  {
    label: `Email ${Modul.UNOR}`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Email ${Modul.UNOR} harus diisi`
      },
      {
        type: 'email',
        message: 'Format email tidak valid!'
      }
    ]
  },
  {
    label: `Logo ${Modul.UNOR}`,
    name: 'logo',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.logo,
          name: data?.UNOR_name
        }
      ];
    },
    accept: ['.png', '.jpg']
  },
  {
    label: `Alamat website ${Modul.UNOR}`,
    name: 'website',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Alamat website ${Modul.UNOR} harus diisi`
      }
    ],
    extra: {
      prefix: <PaperClipOutlined />
    }
  },
  {
    label: `Nomor telp ${Modul.UNOR}`,
    name: 'phone_number',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor telp ${Modul.UNOR} harus diisi`
      },
      {
        pattern: /^62[0-9]{7,13}$/,
        message: 'Nomor telepon harus diawali dengan 62 dan berisi 9–15 digit angka!'
      }
    ],
    extra: {
      prefix: <PhoneOutlined />
    }
  }
];
