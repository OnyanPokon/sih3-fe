import { InputType } from '@/constants';
import WilayahSungaiService from '@/services/WilayahSungaiService';

export const REFERENCE_TYPES = [
  {
    value: 'wilayah_sungai',
    label: 'Wilayah Sungai',
    service: WilayahSungaiService,
    valueKey: 'id',
    labelKey: 'name'
  }
];

export const formFields = ({
  referenceOptions = [],
  onSearchReference,
  isReferenceLoading = false
} = {}) => [
  {
    label: 'Nama Tag',
    name: 'name',
    type: InputType.TEXT,
    placeholder: 'Masukkan Nama Tag',
    rules: [{ required: true, message: 'Nama Tag wajib diisi' }]
  },
  {
    label: 'Deskripsi',
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: 'Deskripsi harus diisi'
      }
    ]
  },
  {
    label: 'Tipe Referensi',
    name: 'reference_type',
    type: InputType.SELECT,
    placeholder: 'Pilih Tipe Referensi (Opsional)',
    options: REFERENCE_TYPES.map((t) => ({ label: t.label, value: t.value }))
  },
  {
    label: (realtimeData) => {
      const selectedType = REFERENCE_TYPES.find((t) => t.value === realtimeData?.reference_type);
      return selectedType ? selectedType.label : 'Referensi Object';
    },
    placeholder: (realtimeData) => {
      const selectedType = REFERENCE_TYPES.find((t) => t.value === realtimeData?.reference_type);
      return selectedType ? `Cari & Pilih ${selectedType.label}` : 'Cari & Pilih Referensi';
    },
    name: 'reference_id',
    type: InputType.SELECT,
    showSearch: true,
    filterOption: false,
    onSearch: onSearchReference,
    loading: isReferenceLoading,
    options: referenceOptions,
    renderIf: (realtimeData) => Boolean(realtimeData?.reference_type)
  }
];
