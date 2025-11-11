import Model from './Model';

export interface IncomingApiData {
  id: number;
  artikel_id: number;
  thumbnail: string;
}

export interface OutgoingApiData {
  artikel_id: number;
  thumbnail: string;
}

interface FormValue {
  article_id: number;
  thumbnail: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Thumbnails extends Model {
  constructor(
    public id: number,
    public article_id: number,
    public thumbnail: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Thumbnails> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Thumbnails>;
    return new Thumbnails(apiData.id, apiData.artikel_id, apiData.thumbnail) as ReturnType<T, IncomingApiData, Thumbnails>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(thumbnails: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(thumbnails)) return thumbnails.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      artikel_id: thumbnails.article_id,
      thumbnail: thumbnails.thumbnail
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.thumbnail = Thumbnails;
