import asset from '@/utils/asset';
import Model from './Model';
import Tags, { IncomingApiData as TagsIncomingApiData } from './Tags';

export interface IncomingApiData {
  id: number;
  kategori_id?: {
    id: number;
    nama_kategori: string;
    slug: string;
    logo: string;
    deskripsi: string;
  } | null;
  judul: string;
  slug: string;
  konten: string;
  status: string;
  tanggal_publikasi: string;
  unor_id?: {
    id: number;
    nama: string;
    wilayah: string;
    alamat: string;
    email: string;
    logo: string;
    website: string;
    no_hp: string;
  } | null;
  user_id?: {
    id: number;
    username: string;
    email: string;
  } | null;
  thumbnails?: {
    id: number;
    artikel_id: number;
    thumbnail: string;
  }[];
  dokumen?: {
    id: number;
    artikel_id: number;
    nama_dokumen?: string;
    dokumen: string;
  }[];
  tags?: TagsIncomingApiData[] | null;
  total_kunjungan: number;
  total_unduh: number;
  kuesioner_tambahan: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  kategori_id: number;
  judul: string;
  konten: string;
  thumbnails: string[];
  kuesioner_tambahan: boolean;
  dokumen: string[] | null;
  tag_ids?: number[];
}

interface FormValue {
  _method?: 'PUT';
  category_id: number;
  title: string;
  content: string;
  thumbnails: string[];
  additional_quiz: boolean;
  doc: string[] | null;
  tag_ids?: number[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Articles extends Model {
  constructor(
    public id: number,
    public category_id: {
      id: number;
      category_name: string;
      slug: string;
      logo: string;
      desc: string;
    },
    public title: string,
    public slug: string,
    public content: string,
    public status: string,
    public publish_date: string,
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
    },
    public thumbnail: string | null,
    public thumbnails: {
      id: number;
      article_id: number;
      thumbnail: string;
    }[],
    public dokumen: {
      id: number;
      article_id: number;
      nama_dokumen?: string;
      dokumen: string;
    }[],
    public doc: {
      id: number;
      article_id: number;
      doc: string;
    }[],
    public tags: Tags[] | null,
    public total_visits: number,
    public total_downloads: number,
    public additional_quiz: boolean,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Articles> {
    if (!apiData) return null as unknown as ReturnType<T, IncomingApiData, Articles>;
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)).filter(Boolean) as ReturnType<T, IncomingApiData, Articles>;
    const thumbnails = Array.isArray(apiData.thumbnails)
      ? apiData.thumbnails.map((item) => ({
          id: item.id,
          article_id: item.artikel_id,
          thumbnail: asset(item.thumbnail)
        }))
      : [];

    const dokumen = Array.isArray(apiData.dokumen)
      ? apiData.dokumen.map((item) => ({
          id: item.id,
          article_id: item.artikel_id,
          nama_dokumen: item.nama_dokumen,
          dokumen: asset(item.dokumen)
        }))
      : [];

    return new Articles(
      apiData.id,
      {
        id: apiData.kategori_id?.id ?? 0,
        category_name: apiData.kategori_id?.nama_kategori ?? '-',
        slug: apiData.kategori_id?.slug ?? '',
        logo: asset(apiData.kategori_id?.logo ?? ''),
        desc: apiData.kategori_id?.deskripsi ?? ''
      },
      apiData.judul ?? '',
      apiData.slug ?? '',
      apiData.konten ?? '',
      apiData.status ?? '',
      apiData.tanggal_publikasi ?? '',
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
        email: apiData.user_id?.email ?? ''
      },
      thumbnails[0]?.thumbnail ?? null,
      thumbnails,
      dokumen,
      dokumen.map((item) => ({
        id: item.id,
        article_id: item.article_id,
        doc: item.dokumen
      })),
      Array.isArray(apiData.tags) ? Tags.fromApiData(apiData.tags) : [],
      apiData.total_kunjungan ?? 0,
      apiData.total_unduh ?? 0,
      Boolean(apiData.kuesioner_tambahan),
      apiData.created_at ?? '',
      apiData.updated_at ?? ''
    ) as ReturnType<T, IncomingApiData, Articles>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(articles: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(articles)) return articles.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(articles._method ? { _method: articles._method } : {}),
      kategori_id: articles.category_id,
      judul: articles.title,
      konten: articles.content,
      thumbnails: articles.thumbnails,
      kuesioner_tambahan: articles.additional_quiz,
      dokumen: articles.doc,
      tag_ids: articles.tag_ids
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.artikel = Articles;
