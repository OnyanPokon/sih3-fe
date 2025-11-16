import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.MAPS}`,
    name: 'map_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.MAPS} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.MAPS}`,
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.MAPS} harus diisi`
      }
    ]
  },
  {
    label: `Kategori ${Modul.MAPS}`,
    name: 'category_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.MAPS} harus diisi`
      }
    ],
    options: options.categories.map((item) => ({
      label: item.category_name,
      value: item.id
    }))
  },

  {
    label: `Status ${Modul.MAPS}`,
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status ${Modul.MAPS} harus diisi`
      }
    ],
    options: [
      {
        label: 'Publikasi',
        value: 'publikasi'
      },
      {
        label: 'Privasi',
        value: 'privasi'
      }
    ]
  },
  {
    label: `File ${Modul.MAPS}`,
    name: 'file',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.file,
          name: data?.map_name
        }
      ];
    },
    accept: ['.geojson', '.zip']
  }
];
