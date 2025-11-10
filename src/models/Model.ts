type ModelKeys = 'personil' | 'profil' | 'artikel' | 'kategori' | 'unor';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    personil: undefined,
    profil: undefined,
    artikel: undefined,
    kategori: undefined,
    unor: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
