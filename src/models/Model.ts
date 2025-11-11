type ModelKeys = 'kategori' | 'personil' | 'profil' | 'unor' | 'artikel' | 'pemetaan' | 'thumbnail' | 'berita';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    kategori: undefined,
    personil: undefined,
    profil: undefined,
    unor: undefined,
    artikel: undefined,
    pemetaan: undefined,
    thumbnail: undefined,
    berita: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
