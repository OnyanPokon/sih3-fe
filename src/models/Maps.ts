import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_pemetaan: string;
  deskripsi: string;
  tipe: 'upload' | 'manual';
  jenis: 'point' | 'polygon' | 'polyline';
  file: string;
  koordinat: string[] | null;
  status: 'publikasi' | 'privasi';
  kategori_id: {
    id: number;
    nama_kategori: string;
    slug: string;
    logo: string;
    deskripsi: string;
  };
  unor_id: {
    id: number;
    nama: string;
    wilayah: string;
    alamat: string;
    email: string;
    logo: string;
    website: string;
    no_hp: string;
  };
  user_id: {
    id: number;
    username: string;
    email: string;
    email_verified_at: string;
  };
}

export interface OutgoingApiData {
  _method?: 'PATCH';
  kategori_id: number;
  nama_pemetaan: string;
  deskripsi: string;
  tipe: 'upload' | 'manual';
  jenis: 'point' | 'polygon' | 'polyline';
  file: string | null;
  koordinat: string[] | null;
  status: 'publikasi' | 'privasi';
}

interface FormValue {
  _method?: 'PATCH';
  category_id: number;
  name: string;
  description: string;
  type: 'upload' | 'manual';
  geometry: 'point' | 'polygon' | 'polyline';
  file: string | null;
  coordinates: string[] | null;
  status: 'publikasi' | 'privasi';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Maps extends Model {
  constructor(
    public id: number,
    public map_name: string,
    public description: string,
    public type: 'upload' | 'manual',
    public geometry: 'point' | 'polygon' | 'polyline',
    public file: string,
    public coordinates: string[] | null,
    public status: 'publikasi' | 'privasi',
    public category_id: {
      id: number;
      category_name: string;
      slug: string;
      logo: string;
      desc: string;
    },
    public unor_id: {
      id: number;
      name: string;
      region: string;
      address: string;
      email: string;
      logo: string;
      website: string;
      phone_number: string;
    },
    public user_id: {
      id: number;
      username: string;
      email: string;
      email_verified_at: string;
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Maps> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Maps>;
    return new Maps(
      apiData.id,
      apiData.nama_pemetaan,
      apiData.deskripsi,
      apiData.tipe,
      apiData.jenis,
      apiData.file,
      apiData.koordinat,
      apiData.status,
      {
        id: apiData.kategori_id.id,
        category_name: apiData.kategori_id.nama_kategori,
        slug: apiData.kategori_id.slug,
        logo: apiData.kategori_id.logo,
        desc: apiData.kategori_id.deskripsi
      },
      {
        id: apiData.unor_id.id,
        name: apiData.unor_id.nama,
        region: apiData.unor_id.wilayah,
        address: apiData.unor_id.alamat,
        email: apiData.unor_id.email,
        logo: apiData.unor_id.logo,
        website: apiData.unor_id.website,
        phone_number: apiData.unor_id.no_hp
      },
      {
        id: apiData.user_id.id,
        username: apiData.user_id.username,
        email: apiData.user_id.email,
        email_verified_at: apiData.user_id.email_verified_at
      }
    ) as ReturnType<T, IncomingApiData, Maps>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(maps: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(maps)) return maps.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(maps._method ? { _method: maps._method } : {}),
      kategori_id: maps.category_id,
      nama_pemetaan: maps.name,
      deskripsi: maps.description,
      tipe: maps.type,
      jenis: maps.geometry,
      file: maps.file,
      koordinat: maps.coordinates,
      status: maps.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.pemetaan = Maps;
