import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.MAPS}`,
    name: 'name',
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
    name: 'desc',
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
  }
];
