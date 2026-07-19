import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ unors = [] } = {}) => [
  {
    label: `Nama ${Modul.CATEGORY}`,
    name: 'category_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.CATEGORY} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.CATEGORY}`,
    name: 'desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.CATEGORY} harus diisi`
      }
    ]
  },
  {
    label: `Logo ${Modul.CATEGORY}`,
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
          name: data?.category_name
        }
      ];
    },
    accept: ['.png', '.jpg']
  },
  {
    label: `Unit Organisasi (Unor)`,
    name: 'unor_ids',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: 'Unit Organisasi (Unor) harus diisi'
      }
    ],
    options: unors.map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
];
