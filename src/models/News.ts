import asset from '@/utils/asset';
import Model from './Model';
import Tags, { IncomingApiData as TagsIncomingApiData } from './Tags';

export interface IncomingApiData {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  thumbnail: string;
  status: 'publikasi' | 'draft';
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
  kategori_id: {
    id: number;
    nama_kategori: string;
    slug: string;
    logo: string;
    deskripsi: string;
  };
  tags?: TagsIncomingApiData[];
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PATCH';
  judul: string;
  konten: string;
  thumbnail: string;
  kategori_id: number;
  status: 'publikasi' | 'draft';
  tag_ids?: number[];
}

interface FormValue {
  _method?: 'PATCH';
  title: string;
  content: string;
  thumbnail: string;
  category_id: number;
  status: 'publikasi' | 'draft';
  tag_ids?: number[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class News extends Model {
  constructor(
    public id: number,
    public title: string,
    public slug: string,
    public content: string,
    public thumbnail: string,
    public status: 'publikasi' | 'draft',
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
    },
    public category_id: {
      id: number;
      category_name: string;
      slug: string;
      logo: string;
      desc: string;
    },
    public tags: Tags[],
    public created_at: string,
    public udpated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, News> {
    if (!apiData) return null as unknown as ReturnType<T, IncomingApiData, News>;
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)).filter(Boolean) as ReturnType<T, IncomingApiData, News>;
    return new News(
      apiData.id ?? 0,
      apiData.judul ?? '',
      apiData.slug ?? '',
      apiData.konten ?? '',
      asset(apiData.thumbnail ?? ''),
      apiData.status ?? 'publikasi',
      {
        id: apiData.unor_id?.id ?? 0,
        name: apiData.unor_id?.nama ?? '-',
        region: apiData.unor_id?.wilayah ?? '',
        address: apiData.unor_id?.alamat ?? '',
        email: apiData.unor_id?.email ?? '',
        logo: apiData.unor_id?.logo ?? '',
        website: apiData.unor_id?.website ?? '',
        phone_number: apiData.unor_id?.no_hp ?? ''
      },
      {
        id: apiData.user_id?.id ?? 0,
        username: apiData.user_id?.username ?? '',
        email: apiData.user_id?.email ?? '',
        email_verified_at: apiData.user_id?.email_verified_at ?? ''
      },
      {
        id: apiData.kategori_id?.id ?? 0,
        category_name: apiData.kategori_id?.nama_kategori ?? '-',
        slug: apiData.kategori_id?.slug ?? '',
        logo: asset(apiData.kategori_id?.logo ?? ''),
        desc: apiData.kategori_id?.deskripsi ?? ''
      },
      Array.isArray(apiData.tags) ? Tags.fromApiData(apiData.tags) : [],
      apiData.created_at ?? '',
      apiData.updated_at ?? ''
    ) as ReturnType<T, IncomingApiData, News>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(news: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(news)) return news.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(news._method ? { _method: news._method } : {}),
      judul: news.title,
      konten: news.content,
      thumbnail: news.thumbnail,
      kategori_id: news.category_id,
      status: news.status,
      tag_ids: news.tag_ids
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.berita = News;
