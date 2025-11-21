import Model from './Model';

interface OutgoingProfileUpdate {
  email: string;
  nama: string;
  nip: string;
  jabatan: string;
  no_hp: string;
}

interface FormValueProfileUpdate {
  email: string;
  name: string;
  nip: string;
  position: string;
  phone_number: string;
}

interface OutgoingPasswordUpdate {
  password_lama: string;
  password_baru: string;
  konfirmasi_password_baru: string;
}

interface FormValuePasswordUpdate {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface OutgoingUnorUpdate {
  nama: string;
  wilayah: string;
  alamat: string;
}

interface FormValueUnorUpdate {
  name: string;
  region: string;
  address: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Profiles extends Model {
  constructor() {
    super();
  }

  public static toApiDataProfileUpdate<T extends FormValueProfileUpdate | FormValueProfileUpdate[]>(profile: T): ReturnType<T, FormValueProfileUpdate, OutgoingProfileUpdate> {
    if (Array.isArray(profile)) return profile.map((object) => this.toApiDataProfileUpdate(object)) as ReturnType<T, FormValueProfileUpdate, OutgoingProfileUpdate>;
    const apiData: OutgoingProfileUpdate = {
      email: profile.email,
      nama: profile.name,
      nip: profile.nip,
      jabatan: profile.position,
      no_hp: profile.phone_number
    };

    return apiData as ReturnType<T, FormValueProfileUpdate, OutgoingProfileUpdate>;
  }

  public static toApiDataPasswordUpdate<T extends FormValuePasswordUpdate | FormValuePasswordUpdate[]>(profile: T): ReturnType<T, FormValuePasswordUpdate, OutgoingPasswordUpdate> {
    if (Array.isArray(profile)) return profile.map((object) => this.toApiDataPasswordUpdate(object)) as ReturnType<T, FormValuePasswordUpdate, OutgoingPasswordUpdate>;
    const apiData: OutgoingPasswordUpdate = {
      password_lama: profile.old_password,
      password_baru: profile.new_password,
      konfirmasi_password_baru: profile.confirm_password
    };

    return apiData as ReturnType<T, FormValuePasswordUpdate, OutgoingPasswordUpdate>;
  }

  public static toApiDataUnorUpdate<T extends FormValueUnorUpdate | FormValueUnorUpdate[]>(profile: T): ReturnType<T, FormValueUnorUpdate, OutgoingUnorUpdate> {
    if (Array.isArray(profile)) return profile.map((object) => this.toApiDataUnorUpdate(object)) as ReturnType<T, FormValueUnorUpdate, OutgoingUnorUpdate>;
    const apiData: OutgoingUnorUpdate = {
      nama: profile.name,
      wilayah: profile.region,
      alamat: profile.address
    };

    return apiData as ReturnType<T, FormValueUnorUpdate, OutgoingUnorUpdate>;
  }
}

Model.children.profil = Profiles;
