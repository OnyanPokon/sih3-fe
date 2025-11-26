import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Judul ${Modul.LEGAL_PRODUCTS}`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.LEGAL_PRODUCTS}`,
    name: 'desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Tahun ${Modul.LEGAL_PRODUCTS}`,
    name: 'year',
    type: InputType.DATE,
    extra: {
      picker: 'year'
    },
    rules: [
      {
        required: true,
        message: `Tahun ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Status ${Modul.LEGAL_PRODUCTS}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    options: [
      {
        label: 'Draft',
        value: 'draft'
      },
      {
        label: 'Publikasi',
        value: 'publikasi'
      }
    ]
  },
  {
    label: `File ${Modul.LEGAL_PRODUCTS}`,
    name: 'file',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.logo,
          name: data?.LEGAL_PRODUCTS_name
        }
      ];
    },
    accept: ['.pdf']
  }
];
