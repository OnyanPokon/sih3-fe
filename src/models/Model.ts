type ModelKeys =
  | 'kategori'
  | 'personil'
  | 'profil'
  | 'unor'
  | 'artikel'
  | 'pemetaan'
  | 'thumbnail'
  | 'berita'
  | 'role'
  | 'permissions'
  | 'kuesioner'
  | 'jenis_pos'
  | 'pos_pengamatan'
  | 'koordinat_telemetri'
  | 'produk_hukum'
  | 'wilayah_sungai'
  | 'tags'
  | 'tag';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    kategori: undefined,
    personil: undefined,
    profil: undefined,
    unor: undefined,
    artikel: undefined,
    pemetaan: undefined,
    thumbnail: undefined,
    berita: undefined,
    role: undefined,
    permissions: undefined,
    kuesioner: undefined,
    jenis_pos: undefined,
    pos_pengamatan: undefined,
    koordinat_telemetri: undefined,
    produk_hukum: undefined,
    wilayah_sungai: undefined,
    tags: undefined,
    tag: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
