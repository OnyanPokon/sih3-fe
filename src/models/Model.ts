type ModelKeys = 'personil' | 'profil' | 'artikel' | 'kategori';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    personil: undefined,
    profil: undefined,
    artikel: undefined,
    kategori: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
