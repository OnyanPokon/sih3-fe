import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.OBSERVATION_POS}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.OBSERVATION_POS} harus diisi`
      }
    ]
  },
  {
    label: `Alamat ${Modul.OBSERVATION_POS}`,
    name: 'address',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Alamat ${Modul.OBSERVATION_POS} harus diisi`
      }
    ]
  },
  {
    label: `Jenis Pos ${Modul.OBSERVATION_POS}`,
    name: 'pos_type_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Jenis Pos ${Modul.OBSERVATION_POS} harus diisi`
      }
    ],
    options: options.posTypes.map((item) => ({
      label: item.name,
      value: item.id
    }))
  },
  {
    label: 'Lokasi',
    type: InputType.MAP_PICKER
  },
  {
    label: 'Latitude',
    name: 'latitude',
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Latitude harus diisi' }]
  },
  {
    label: 'Longitude',
    name: 'longitude',
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Longitude harus diisi' }]
  }
];
