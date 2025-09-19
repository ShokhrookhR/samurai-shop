export interface IProductInputModel {
  page: number;
  size: number;
  title?: string;
  sortBy?: 'asc' | 'desc';
}
