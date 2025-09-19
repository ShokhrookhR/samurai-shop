export interface IProduct {
  id?: number;
  uid?: string;
  title: string;
  price?: number;
}
export interface IDBProduct {
  _id: string;
  id: number;
  title: string;
  price?: number;
}
