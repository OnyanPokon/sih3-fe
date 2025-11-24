import Model from './Model';

export interface IncomingApiData {
  id: number;
  jenis_pos_id: {
    id: number;
    unor_id: number;
    user_id: number;
    kategori_id: number;
    nama: string;
    slug: string;
    kewenangan: string;
    status: string;
  };
  nama: string;
  koordinat: string;
  alamat: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  jenis_pos_id: number;
  nama: string;
  koordinat: string;
  alamat: string;
}

interface FormValue {
  pos_type_id: number;
  name: string;
  coordinate: string;
  address: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ObservationPos extends Model {
  constructor(
    public id: number,
    public pos_type_id: {
      id: number;
      id_kategori: number;
      id_unor: number;
      id_user: number;
      name: string;
      slug: string;
      authority: string;
      status: 'publikasi' | 'draft';
    },
    public name: string,
    public coordinate: string,
    public address: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ObservationPos> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ObservationPos>;
    return new ObservationPos(
      apiData.id,
      {
        id: apiData.jenis_pos_id.id,
        id_kategori: apiData.jenis_pos_id.kategori_id,
        id_unor: apiData.jenis_pos_id.unor_id,
        id_user: apiData.jenis_pos_id.user_id,
        name: apiData.jenis_pos_id.nama,
        slug: apiData.jenis_pos_id.slug,
        authority: apiData.jenis_pos_id.kewenangan,
        status: apiData.jenis_pos_id.status as 'publikasi' | 'draft'
      },
      apiData.nama,
      apiData.koordinat,
      apiData.alamat,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, ObservationPos>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(observationPos: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(observationPos)) return observationPos.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama: observationPos.name,
      alamat: observationPos.address,
      jenis_pos_id: observationPos.pos_type_id,
      koordinat: observationPos.coordinate
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.pos_pengamatan = ObservationPos;
