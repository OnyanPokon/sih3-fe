import Model from './Model';

export interface IncomingApiData {
  id: number;
  kategori_id: {
    id: number;
    nama_kategori: string;
    slug: string;
    logo: string;
    deskripsi: string;
  };
  judul: string;
  slug: string;
  konten: string;
  status: string;
  tanggal_publikasi: string;
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
  thumbnails: [
    {
      id: number;
      artikel_id: number;
      thumbnail: string;
    }
  ];
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  kategori_id: number;
  judul: string;
  konten: string;
  thumbnails: string[];
}

interface FormValue {
  category_id: number;
  title: string;
  content: string;
  thumbnails: string[];
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
    public thumbnails: {
      id: number;
      article_id: number;
      thumbnail: string;
    }[],
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Articles> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Articles>;
    return new Articles(
      apiData.id,
      {
        id: apiData.kategori_id.id,
        category_name: apiData.kategori_id.nama_kategori,
        slug: apiData.kategori_id.slug,
        logo: apiData.kategori_id.logo,
        desc: apiData.kategori_id.deskripsi
      },
      apiData.judul,
      apiData.slug,
      apiData.konten,
      apiData.status,
      apiData.tanggal_publikasi,
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
      apiData.thumbnails.map((item) => ({
        id: item.id,
        article_id: item.artikel_id,
        thumbnail: item.thumbnail
      })),
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Articles>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(articles: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(articles)) return articles.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      kategori_id: articles.category_id,
      judul: articles.title,
      konten: articles.content,
      thumbnails: articles.thumbnails
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.artikel = Articles;
