import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {ProductRepository} from '../repositories/productRepository';
import {IProduct} from '../types';
// import {productsCollection} from './db';

export class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }
  private readonly repository: ProductRepository;
  async findProducts(
    query: IProductInputModel
  ): Promise<IProductViewModel<IProduct>> {
    return await this.repository.findProducts(query);
  }
  async findProductById(id: number): Promise<IProduct | null> {
    const foundProduct = await this.repository.findProductById(id);

    return foundProduct;
  }
  async createProduct(
    payload: IProduct,
    userId: string
  ): Promise<IProduct | null> {
    const newProduct = {
      id: +new Date(),
      title: payload.title,
      price: payload.price,
    };
    await this.repository.createProduct(newProduct, userId);
    return newProduct;
  }
}
