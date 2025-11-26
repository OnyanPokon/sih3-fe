import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Tanggal ${Modul.OBSERVATION_POS}`,
    name: 'date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal ${Modul.OBSERVATION_POS} harus diisi`
      }
    ]
  },
  {
    label: `Waktu ${Modul.OBSERVATION_POS}`,
    name: 'time',
    type: InputType.TIME,
    rules: [
      {
        required: true,
        message: `Waktu ${Modul.OBSERVATION_POS} harus diisi`
      }
    ],
    extra: {
      format: 'HH:mm'
    }
  },
  {
    label: `Warna ${Modul.OBSERVATION_POS}`,
    name: 'color',
    type: InputType.COLOR,
    rules: [
      {
        required: true,
        message: `Warna ${Modul.OBSERVATION_POS} harus diisi`
      }
    ]
  },
  {
    label: `Rating ${Modul.OBSERVATION_POS}`,
    name: 'rating',
    type: InputType.NUMBER,
    rules: [
      {
        required: true,
        message: `Rating ${Modul.OBSERVATION_POS} harus diisi`
      }
    ]
  }
];
