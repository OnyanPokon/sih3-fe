import Model from './Model';

export interface IncomingApiData {
  id: number;
  pos_pengamatan_id: {
    id: number;
    jenis_pos_id: number;
    nama: string;
    koordinat: string;
    alamat: string;
  };
  nilai: number;
  waktu: string;
  tanggal: string;
  warna: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  pos_pengamatan_id: number;
  nilai: number;
  tanggal: string;
  waktu: string;
  warna: string;
}

interface FormValue {
  _method?: 'PUT';
  observation_pos_id: number;
  rating: number;
  date: string;
  time: string;
  color: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class TelemetryCoordinates extends Model {
  constructor(
    public id: number,
    public observation_pos_id: {
      id: number;
      pos_types_id: number;
      name: string;
      coordinate: string;
      address: string;
    },
    public rating: number,
    public time: string,
    public date: string,
    public color: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, TelemetryCoordinates> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, TelemetryCoordinates>;
    return new TelemetryCoordinates(
      apiData.id,
      {
        id: apiData.pos_pengamatan_id.id,
        pos_types_id: apiData.pos_pengamatan_id.jenis_pos_id,
        name: apiData.pos_pengamatan_id.nama,
        coordinate: apiData.pos_pengamatan_id.koordinat,
        address: apiData.pos_pengamatan_id.alamat
      },
      apiData.nilai,
      apiData.waktu,
      apiData.tanggal,
      apiData.warna
    ) as ReturnType<T, IncomingApiData, TelemetryCoordinates>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(telemetryCoordinates: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(telemetryCoordinates)) return telemetryCoordinates.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(telemetryCoordinates._method ? { _method: telemetryCoordinates._method } : {}),
      pos_pengamatan_id: telemetryCoordinates.observation_pos_id,
      nilai: telemetryCoordinates.observation_pos_id,
      tanggal: telemetryCoordinates.date,
      waktu: telemetryCoordinates.time,
      warna: telemetryCoordinates.color
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.koordinat_telemetri = TelemetryCoordinates;
