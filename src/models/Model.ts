type ModelKeys = 'kategori' | 'personil' | 'profil' | 'unor' | 'artikel' | 'pemetaan' | 'thumbnail';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    kategori: undefined,
    personil: undefined,
    profil: undefined,
    unor: undefined,
    artikel: undefined,
    pemetaan: undefined,
    thumbnail: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
