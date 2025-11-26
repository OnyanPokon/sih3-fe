import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  file: string;
  tahun: string;
  status: 'draft' | 'publikasi';
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
  _method?: 'PUT';
  judul: string;
  deskripsi: string;
  file: string;
  tahun: number;
  status: 'draft' | 'publikasi';
}

interface FormValue {
  _method?: 'PUT';
  title: string;
  desc: string;
  file: string;
  year: number;
  status: 'draft' | 'publikasi';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class LegalProducts extends Model {
  constructor(
    public id: number,
    public title: string,
    public slug: string,
    public desc: string,
    public file: string,
    public year: string,
    public status: 'draft' | 'publikasi',
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LegalProducts> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LegalProducts>;
    return new LegalProducts(
      apiData.id,
      apiData.judul,
      apiData.slug,
      apiData.deskripsi,
      asset(apiData.file),
      apiData.tahun,
      apiData.status,
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
    ) as ReturnType<T, IncomingApiData, LegalProducts>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(legalProducts: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(legalProducts)) return legalProducts.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(legalProducts._method ? { _method: legalProducts._method } : {}),
      judul: legalProducts.title,
      deskripsi: legalProducts.desc,
      file: legalProducts.file,
      tahun: legalProducts.year,
      status: legalProducts.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.produk_hukum = LegalProducts;
