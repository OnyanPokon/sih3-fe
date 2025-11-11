import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_kategori: string;
  slug: string;
  logo: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_kategori: string;
  deskripsi: string;
  logo: string;
}

interface FormValue {
  _method?: 'PUT';
  category_name: string;
  desc: string;
  logo: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Categories extends Model {
  constructor(
    public id: number,
    public category_name: string,
    public slug: string,
    public logo: string,
    public desc: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Categories> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Categories>;
    return new Categories(apiData.id, apiData.nama_kategori, apiData.slug, asset(apiData.logo), apiData.deskripsi, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Categories>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(categories: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(categories)) return categories.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(categories._method ? { _method: categories._method } : {}),
      nama_kategori: categories.category_name,
      deskripsi: categories.desc,
      logo: categories.logo
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.kategori = Categories;
