import Model from './Model';

export interface IncomingApiData {
  id: number;
  artikel_id: {
    id: number;
    kategori_id: number;
    unor_id: number;
    user_id: number;
    judul: string;
    slug: string;
  };
  nama: string;
  instansi: string;
  asal: string;
  deskripsi: string;
  nilai: number;
  created_at: string;
}

export interface OutgoingApiData {
  artikel_id: number;
  nama: string;
  instansi: string;
  asal: string;
  deskripsi: string;
  nilai: number;
}

interface FormValue {
  id_article: number;
  name: string;
  agency: string;
  provenance: string;
  desc: string;
  rating: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Kuesioners extends Model {
  constructor(
    public id: number,
    public id_article: {
      id: number;
      category_id: number;
      unor_id: number;
      user_id: number;
      title: string;
      slug: string;
    },
    public name: string,
    public agency: string,
    public provenence: string,
    public rating: number
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Kuesioners> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Kuesioners>;
    return new Kuesioners(
      apiData.id,
      {
        id: apiData.artikel_id.id,
        category_id: apiData.artikel_id.kategori_id,
        unor_id: apiData.artikel_id.unor_id,
        user_id: apiData.artikel_id.user_id,
        title: apiData.artikel_id.judul,
        slug: apiData.artikel_id.slug
      },
      apiData.nama,
      apiData.instansi,
      apiData.asal,
      apiData.nilai
    ) as ReturnType<T, IncomingApiData, Kuesioners>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(kuesioners: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(kuesioners)) return kuesioners.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      artikel_id: kuesioners.id_article,
      nama: kuesioners.name,
      instansi: kuesioners.agency,
      asal: kuesioners.provenance,
      deskripsi: kuesioners.desc,
      nilai: kuesioners.rating
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.kuesioner = Kuesioners;
