import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.POSTYPES}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.POSTYPES} harus diisi`
      }
    ]
  },
  {
    label: `Kewenangan ${Modul.POSTYPES}`,
    name: 'authority',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kewenangan ${Modul.POSTYPES} harus diisi`
      }
    ]
  },
  {
    label: `Kategori ${Modul.POSTYPES}`,
    name: 'id_kategori',
    type: InputType.SELECT,
    placeholder: 'Masukan Kategori',
    rules: [
      {
        required: true,
        message: `Kategori ${Modul.POSTYPES} harus diisi`
      }
    ],
    options: options.categories.map((item) => ({
      label: item.category_name,
      value: item.id
    }))
  },
  {
    label: `Status ${Modul.POSTYPES}`,
    name: 'status',
    type: InputType.SELECT,
    placeholder: 'Pilih status publikasi',
    rules: [
      {
        required: true,
        message: `Status ${Modul.POSTYPES} harus diisi`
      }
    ],
    options: [
      {
        label: 'Publikasi',
        value: 'publikasi'
      },
      {
        label: 'Draft',
        value: 'draft'
      }
    ]
  },
  {
    label: 'Tag',
    name: 'tag_ids',
    type: InputType.SELECT,
    mode: 'multiple',
    placeholder: 'Pilih Tag (Opsional)',
    options: (options.tags || []).map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
];

export const posTypesFilterFields = ({ options }) => [
  {
    label: `Status publikasi`,
    name: 'status',
    type: InputType.SELECT,
    placeholder: 'Pilih status publikasi',
    options: [
      {
        label: 'Publikasi',
        value: 'publikasi'
      },
      {
        label: 'Draft',
        value: 'draft'
      }
    ]
  },
  {
    label: `Kategori ${Modul.POSTYPES}`,
    name: 'id_kategori',
    type: InputType.SELECT,
    placeholder: 'Pilih kategori',
    options: options.categories.map((item) => ({
      label: item.category_name,
      value: item.id
    }))
  }
];
