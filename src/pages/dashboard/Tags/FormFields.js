import { InputType } from '@/constants';
import WilayahSungaiService from '@/services/WilayahSungaiService';

export const TAG_FORM_MODE = {
  WITH_REFERENCE: 'with_reference',
  WITHOUT_REFERENCE: 'without_reference'
};

export const REFERENCE_TYPES = [
  {
    value: 'wilayah_sungai',
    label: 'Wilayah Sungai',
    service: WilayahSungaiService,
    valueKey: 'id',
    labelKey: 'name'
  }
];

export const formFields = ({ mode = TAG_FORM_MODE.WITHOUT_REFERENCE, categoryOptions = [], referenceOptions = [], onSearchReference, isReferenceLoading = false } = {}) => {
  const baseFields = [
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
      label: 'Kategori',
      name: 'category_id',
      type: InputType.SELECT,
      placeholder: 'Pilih Kategori',
      rules: [
        {
          required: true,
          message: 'Kategori harus diisi'
        }
      ],
      options: categoryOptions.map((item) => ({
        label: item.nama,
        value: item.id
      }))
    }
  ];

  if (mode === TAG_FORM_MODE.WITH_REFERENCE) {
    return [
      ...baseFields,
      {
        label: 'Tipe Referensi',
        name: 'reference_type',
        type: InputType.SELECT,
        placeholder: 'Pilih Tipe Referensi',
        rules: [{ required: true, message: 'Tipe referensi wajib dipilih' }],
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
        rules: [{ required: true, message: 'Referensi wajib dipilih' }],
        options: referenceOptions,
        renderIf: (realtimeData) => Boolean(realtimeData?.reference_type)
      }
    ];
  }

  return [
    ...baseFields,
    {
      label: 'Warna Tag',
      name: 'color',
      type: InputType.COLOR,
      rules: [
        {
          required: true,
          message: 'Warna Tag wajib diisi'
        }
      ]
    },
    {
      label: 'Icon Tag',
      name: 'icon',
      type: InputType.SELECT_ICON,
      placeholder: 'Masukkan Icon Tag',
      rules: [
        {
          required: true,
          message: 'Icon Tag wajib diisi'
        }
      ]
    }
  ];
};
