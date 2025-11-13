import Model from './Model';

export interface IncomingApiData {
  id: number;
  name: string;
  guard: string;
  permissions: string[];
}

export interface OutgoingApiData {
  name: string;
  permissions: string[];
}

interface FormValue {
  name: string;
  permissions: string[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Roles extends Model {
  constructor(
    public id: number,
    public name: string,
    public guard: string,
    public permissions: string[]
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Roles> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Roles>;
    return new Roles(apiData.id, apiData.name, apiData.guard, apiData.permissions) as ReturnType<T, IncomingApiData, Roles>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(roles: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(roles)) return roles.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: roles.name,
      permissions: roles.permissions
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.role = Roles;
