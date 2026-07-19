import asset from '@/utils/asset';
import Model from './Model';
import Categories, { IncomingApiData as CategoryIncomingApiData } from './Categories';
import Unors, { IncomingApiData as UnorIncomingApiData } from './Unors';

export interface IncomingApiData {
  id: number;
  kategori_id: number;
  kategori?: CategoryIncomingApiData;
  unor_id: number;
  unor?: UnorIncomingApiData;
  kewenangan: string;
  nama: string;
  deskripsi: string;
  thumbnail: string;
  luas_wilayah: string;
  total_titik_pantau: number;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  kategori_id: number;
  kewenangan: string;
  nama: string;
  deskripsi: string;
  thumbnail?: string;
  luas_wilayah: string;
  total_titik_pantau: number;
}

interface FormValue {
  _method?: 'PUT';
  kategori_id: number;
  kewenangan: string;
  nama: string;
  deskripsi: string;
  thumbnail?: any;
  luas_wilayah: string;
  total_titik_pantau: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class WilayahSungai extends Model {
  constructor(
    public id: number,
    public kategori_id: number,
    public category: Categories | null,
    public unor_id: number,
    public unor: Unors | null,
    public kewenangan: string,
    public name: string,
    public description: string,
    public thumbnail: string,
    public luas_wilayah: string,
    public total_titik_pantau: number,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, WilayahSungai> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, WilayahSungai>;
    return new WilayahSungai(
      apiData.id,
      apiData.kategori_id,
      apiData.kategori ? Categories.fromApiData(apiData.kategori) : null,
      apiData.unor_id,
      apiData.unor ? Unors.fromApiData(apiData.unor) : null,
      apiData.kewenangan,
      apiData.nama,
      apiData.deskripsi,
      asset(apiData.thumbnail),
      apiData.luas_wilayah,
      apiData.total_titik_pantau,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, WilayahSungai>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(formValues: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(formValues)) return formValues.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(formValues._method ? { _method: formValues._method } : {}),
      kategori_id: formValues.kategori_id,
      kewenangan: formValues.kewenangan,
      nama: formValues.nama,
      deskripsi: formValues.deskripsi,
      luas_wilayah: formValues.luas_wilayah,
      total_titik_pantau: formValues.total_titik_pantau
    };

    if (formValues.thumbnail) {
      apiData.thumbnail = formValues.thumbnail;
    }

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.wilayah_sungai = WilayahSungai;
