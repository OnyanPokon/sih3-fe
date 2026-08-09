import Model from './Model';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  user_id: {
    id: number;
    email: string;
    username: string;
    role: string;
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
    created_at: string;
    updated_at: string;
  } | null;
  nama: string;
  nip: string;
  jabatan: string;
  no_hp: string;
  status: 'aktif' | 'nonaktif';
}

export interface OutgoingApiData {
  _method?: 'PATCH';
  email: string;
  nama: string;
  nip: string;
  unor_id?: number;
  jabatan?: string;
  no_hp?: string;
  role?: string;
}

interface FormValue {
  _method?: 'PATCH';
  email: string;
  name: string;
  nip: string;
  unor_id?: number;
  position?: string;
  phone_number?: string;
  role?: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Personils extends Model {
  constructor(
    public id: number,
    public user_id: {
      id: number;
      email: string;
      username: string;
      role: string;
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
      created_at: string;
      updated_at: string;
    } | null,
    public name: string,
    public nip: string,
    public position: string,
    public phone_number: string,
    public status: 'aktif' | 'nonaktif'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Personils> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Personils>;
    return new Personils(
      apiData.id,
      {
        id: apiData.user_id.id,
        email: apiData.user_id.email,
        username: apiData.user_id.username,
        role: apiData.user_id.role
      },
      apiData.unor_id
        ? {
            id: apiData.unor_id.id,
            name: apiData.unor_id.nama,
            region: apiData.unor_id.wilayah,
            address: apiData.unor_id.alamat,
            email: apiData.unor_id.email,
            logo: asset(apiData.unor_id.logo),
            website: apiData.unor_id.website,
            phone_number: apiData.unor_id.no_hp,
            created_at: apiData.unor_id.created_at,
            updated_at: apiData.unor_id.updated_at
          }
        : null,
      apiData.nama,
      apiData.nip,
      apiData.jabatan,
      apiData.no_hp,
      apiData.status
    ) as ReturnType<T, IncomingApiData, Personils>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(personils: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(personils)) return personils.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(personils._method ? { _method: personils._method } : {}),
      email: personils.email,
      nama: personils.name,
      nip: personils.nip,
      ...(personils.unor_id ? { unor_id: personils.unor_id } : {}),
      ...(personils.position ? { jabatan: personils.position } : {}),
      ...(personils.phone_number ? { no_hp: personils.phone_number } : {}),
      ...(personils.role ? { role: personils.role } : {})
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.personil = Personils;
