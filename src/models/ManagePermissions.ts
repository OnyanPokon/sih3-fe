import Model from './Model';

export interface IncomingApiData {
  id: number;
  name: string;
  guard_name: string;
}

export interface OutgoingApiData {
  name: string;
}

interface FormValue {
  name: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ManagePermissions extends Model {
  constructor(
    public id: number,
    public name: string,
    public guard_name: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ManagePermissions> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ManagePermissions>;
    return new ManagePermissions(apiData.id, apiData.name, apiData.guard_name) as ReturnType<T, IncomingApiData, ManagePermissions>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(managePermissions: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(managePermissions)) return managePermissions.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: managePermissions.name
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.permissions = ManagePermissions;
