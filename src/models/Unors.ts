import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama: string;
  wilayah: string;
  alamat: string;
  email: string;
  logo: string;
  website: string;
  no_hp: string;
}

export interface OutgoingApiData {
  _method?: 'PATCH';
  nama: string;
  wilayah: string;
  alamat: string;
  email: string;
  logo: string;
  website: string;
  no_hp: string;
}

interface FormValue {
  _method?: 'PATCH';
  name: string;
  region: string;
  address: string;
  email: string;
  logo: string;
  website: string;
  phone_number: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Unors extends Model {
  constructor(
    public id: number,
    public name: string,
    public region: string,
    public address: string,
    public email: string,
    public logo: string,
    public website: string,
    public phone_number: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Unors> {
    if (!apiData) return null as unknown as ReturnType<T, IncomingApiData, Unors>;
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)).filter(Boolean) as ReturnType<T, IncomingApiData, Unors>;
    return new Unors(
      apiData.id ?? 0,
      apiData.nama ?? '',
      apiData.wilayah ?? '',
      apiData.alamat ?? '',
      apiData.email ?? '',
      asset(apiData.logo ?? ''),
      apiData.website ?? '',
      apiData.no_hp ?? ''
    ) as ReturnType<T, IncomingApiData, Unors>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(unors: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(unors)) return unors.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(unors._method ? { _method: unors._method } : {}),
      nama: unors.name,
      wilayah: unors.region,
      alamat: unors.address,
      email: unors.email,
      logo: unors.logo,
      website: unors.website,
      no_hp: unors.phone_number
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.unor = Unors;
