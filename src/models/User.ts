import { Action, Role } from '@/constants';
import Model, { ModelChildren } from './Model';
import Permission from './Permission';

export interface IncomingApiData {
  id: number;
  email: string;
  username: string;
  role: string;
  permissions: string[];
  unor?: {
    nama: string;
    wilayah: string;
  };
}

interface OutgoingApiData {
  email: IncomingApiData['email'];
}

export default class User extends Model {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public token: string,
    public role: Role,
    public permissions: Permission[] = []
  ) {
    super();
  }

  is(role: Role) {
    return this.role === role;
  }

  can(action: Action, model: ModelChildren) {
    return this.permissions.some((permission) => permission.can(action, model));
  }

  cant(action: Action, model: ModelChildren) {
    return !this.can(action, model);
  }

  eitherIs(...roles: Role[]) {
    return roles.some((role) => this.is(role));
  }

  eitherCan(...permissions: [Action, ModelChildren][]) {
    return permissions.some(([action, model]) => this.can(action, model));
  }

  cantDoAny(...permissions: [Action, ModelChildren][]) {
    return !this.eitherCan(...permissions);
  }

  static fromApiData(apiData: IncomingApiData, token: string): User {
    const roles: Record<string, Role> = {
      admin: Role.ADMIN
    };

    const role = roles[apiData.role];

    const validPermissions = apiData.permissions.filter((p) => {
      return p.includes('_');
    });

    const permissions = Permission.fromApiData(validPermissions);

    return new User(apiData.id, apiData.email, apiData.username, token, role, permissions);
  }

  static toApiData(user: User): OutgoingApiData {
    return {
      email: user.email
    };
  }
}
