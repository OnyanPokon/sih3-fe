import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.ROLE}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.ROLE} harus diisi`
      }
    ]
  },
  {
    label: `Permission ${Modul.ROLE}`,
    name: 'permissions',
    mode: 'multiple',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Permission ${Modul.ROLE} harus diisi`
      }
    ],
    options: options.permissions.map((item) => ({
      label: item.name,
      value: item.name
    }))
  }
];
