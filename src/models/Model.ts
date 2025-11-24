type ModelKeys = 'kategori' | 'personil' | 'profil' | 'unor' | 'artikel' | 'pemetaan' | 'thumbnail' | 'berita' | 'role' | 'permissions' | 'kuesioner' | 'jenis_pos' | 'pos_pengamatan';

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
    pos_pengamatan: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
