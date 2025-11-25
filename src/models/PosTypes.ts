import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama: string;
  slug: string;
  kewenangan: string;
  status: 'publikasi' | 'draft';
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
  };
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  kategori_id: number;
  nama: string;
  kewenangan: string;
  status: 'publikasi' | 'draft';
}

interface FormValue {
  id_kategori: number;
  name: string;
  authority: string;
  status: 'publikasi' | 'draft';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class PosTypes extends Model {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public authority: string,
    public status: 'publikasi' | 'draft',
    public id_kategori: {
      id: number;
      category_name: string;
      slug: string;
      logo: string;
      desc: string;
    },
    public id_unor: {
      id: number;
      name: string;
      region: string;
      address: string;
      email: string;
      logo: string;
      website: string;
      phone_number: string;
    },
    public id_user: {
      id: number;
      username: string;
      email: string;
    },

    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, PosTypes> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, PosTypes>;
    return new PosTypes(
      apiData.id,
      apiData.nama,
      apiData.slug,
      apiData.kewenangan,
      apiData.status,
      {
        id: apiData.kategori_id.id,
        category_name: apiData.kategori_id.nama_kategori,
        slug: apiData.kategori_id.slug,
        logo: asset(apiData.kategori_id.logo),
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
        email: apiData.user_id.email
      },
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, PosTypes>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(posTypes: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(posTypes)) return posTypes.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      kategori_id: posTypes.id_kategori,
      nama: posTypes.name,
      kewenangan: posTypes.authority,
      status: posTypes.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.jenis_pos = PosTypes;
