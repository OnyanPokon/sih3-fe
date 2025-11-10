import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.PERSONIL}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.PERSONIL} harus diisi`
      }
    ]
  },
  {
    label: `NIP ${Modul.PERSONIL}`,
    name: 'nip',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIP ${Modul.PERSONIL} harus diisi`
      }
    ]
  },

  {
    label: `Email ${Modul.PERSONIL}`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Email ${Modul.PERSONIL} harus diisi`
      },
      {
        type: 'email',
        message: 'Format email tidak valid!'
      }
    ]
  },
  {
    label: `Unor ${Modul.PERSONIL}`,
    name: 'unor_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Unor ${Modul.PERSONIL} harus diisi`
      }
    ],
    options: options.unors.map((item) => ({
      label: item.name,
      value: item.id
    }))
  },
  {
    label: `Role ${Modul.PERSONIL}`,
    name: 'role',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Role ${Modul.PERSONIL} harus diisi`
      }
    ],
    options: [
      {
        label: 'Admin',
        value: 'admin'
      },
      {
        label: 'Superadmin',
        value: 'superadmin'
      }
    ]
  }
];
