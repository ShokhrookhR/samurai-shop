export interface IProductInputModel {
  page: number;
  size: number;
  title?: string;
  sortBy?: 'asc' | 'desc';
}
export interface IProductInputBodyModel {
  title: string;
  price?: number;
}
