import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ categories = [] } = {}) => [
  {
    label: `Nama Wilayah Sungai`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Nama Wilayah Sungai harus diisi'
      }
    ]
  },
  {
    label: `Kategori`,
    name: 'kategori_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: 'Kategori harus diisi'
      }
    ],
    options: categories.map((item) => ({
      label: item.category_name || item.nama_kategori,
      value: item.id
    }))
  },
  {
    label: `Kewenangan`,
    name: 'kewenangan',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Kewenangan harus diisi'
      }
    ]
  },
  {
    label: `Luas Wilayah`,
    name: 'luas_wilayah',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Luas Wilayah harus diisi'
      }
    ]
  },
  {
    label: `Total Titik Pantau`,
    name: 'total_titik_pantau',
    type: InputType.NUMBER,
    min: 0,
    rules: [
      {
        required: true,
        message: 'Total Titik Pantau harus diisi'
      }
    ]
  },
  {
    label: `Deskripsi`,
    name: 'deskripsi',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: false
      }
    ]
  },
  {
    label: `Thumbnail`,
    name: 'thumbnail',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.thumbnail,
          name: data?.nama
        }
      ];
    },
    accept: ['.png', '.jpg', '.jpeg', '.webp']
  }
];
