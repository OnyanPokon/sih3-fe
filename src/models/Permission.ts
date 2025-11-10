import { Action } from '@/constants';
import env from '@/utils/env';
import Model, { ModelChildren } from './Model';

export type ApiData = string;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Permission extends Model {
  constructor(
    public name: string,
    public action: Action,
    public model: ModelChildren | string
  ) {
    super();
  }

  can(action: Action, model: ModelChildren) {
    if (typeof this.model === 'string') return this.action.name === action.name;
    return this.action.name === action.name && this.model === model;
  }

  private static actions = {
    kelola: [Action.READ, Action.UPDATE, Action.DELETE, Action.CREATE],
    perbarui: [Action.UPDATE],
    lihat: [Action.READ]
  };

  static fromApiData<T extends ApiData | ApiData[]>(apiData: T): ReturnType<T, ApiData, Permission> {
    if (Array.isArray(apiData)) return apiData.flatMap((object) => this.fromApiData(object)) as ReturnType<T, ApiData, Permission>;

    const arrays = apiData.split('_');
    const actionsString = arrays.shift();
    const modelString = arrays.join('_');

    const actions = this.actions[actionsString as keyof typeof this.actions] || [Action.NONE];

    const model = Model.children[modelString as keyof typeof Model.children];

    if (!model) {
      env.dev(() => console.warn(`Model "${modelString}" tidak ditemukan untuk permission "${apiData}"`));
      return actions.map((action) => new Permission(apiData, action, modelString)) as ReturnType<T, ApiData, Permission>;
    }

    if (Array.isArray(model)) return actions.flatMap((action) => model.map((m) => new Permission(apiData, action, m))) as ReturnType<T, ApiData, Permission>;

    return actions.map((action) => new Permission(apiData, action, model)) as ReturnType<T, ApiData, Permission>;
  }

  static toApiData<T extends Permission | Permission[]>(permission: T): ReturnType<T, Permission, ApiData> {
    if (Array.isArray(permission)) return permission.map((object) => this.toApiData(object)) as ReturnType<T, Permission, ApiData>;
    return permission.name as ReturnType<T, Permission, ApiData>;
  }
}
