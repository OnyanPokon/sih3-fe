import Model from './Model';
import WilayahSungai, { IncomingApiData as WilayahSungaiIncomingApiData } from './WilayahSungai';

export interface IncomingApiData {
  id: number;
  user_id: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  nama: string;
  deskripsi: string | null;
  referensi_type: string | null;
  referensi_id: number | null;
  referensi?: WilayahSungaiIncomingApiData | null;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama: string;
  deskripsi?: string | null;
  referensi_type?: string | null;
  referensi_id?: number | null;
}

interface FormValue {
  _method?: 'PUT';
  name: string;
  description?: string;
  reference_type?: string;
  reference_id?: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Tags extends Model {
  constructor(
    public id: number,
    public user_id: number,
    public user: { id: number; username: string; email: string } | null,
    public name: string,
    public description: string | null,
    public reference_type: string | null,
    public reference_id: number | null,
    public reference: WilayahSungai | null,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Tags> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Tags>;
    return new Tags(
      apiData.id,
      apiData.user_id,
      apiData.user ?? null,
      apiData.nama,
      apiData.deskripsi,
      apiData.referensi_type,
      apiData.referensi_id,
      apiData.referensi ? WilayahSungai.fromApiData(apiData.referensi) : null,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Tags>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(formValues: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(formValues)) return formValues.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(formValues._method ? { _method: formValues._method } : {}),
      nama: formValues.name,
      deskripsi: formValues.description || null,
      referensi_type: formValues.reference_type || null,
      referensi_id: formValues.reference_id || null
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.tags = Tags;
Model.children.tag = Tags;

