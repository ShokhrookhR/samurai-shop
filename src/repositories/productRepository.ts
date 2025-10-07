import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {IProduct, IDBProduct} from '../types';
import {productsCollectionWrite, productCollectionRead} from './db';
import {OptionalId, WithId} from 'mongodb';
export class ProductRepository {
  constructor() {
    this.collectionRead = productCollectionRead;
    this.collectionWrite = productsCollectionWrite;
  }
  private collectionRead;
  private collectionWrite;
  async findProducts(
    query: IProductInputModel
  ): Promise<IProductViewModel<IProduct>> {
    const filter: any = {};

    if (query.title) {
      filter.title = {$regex: query.title};
    }
    const productsCount = await this.collectionRead.countDocuments();

    const productsFromDB = await this.collectionRead
      .find(filter)
      .sort({title: query.sortBy === 'asc' ? 1 : -1})
      .skip(this.calculateSkip(+query.page, +query.size))
      .limit(+query.size)
      .toArray();
    const mappedProducts = productsFromDB.map((product) => {
      return this.mapToProduct(product);
    });

    const responseBody = {
      data: mappedProducts,
      totalCount: productsCount,
    };

    return responseBody;
  }
  async findProductById(id: number): Promise<IProduct | null> {
    const foundProduct = await this.collectionRead.findOne({id});

    return foundProduct;
  }
  async createProduct(
    newProduct: IProduct,
    userId: string
  ): Promise<IProduct | null> {
    const insertDoc: OptionalId<any> = {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      userId,
    };
    await this.collectionWrite.insertOne(insertDoc);

    return insertDoc;
  }
  private mapToProduct(dbObject: IDBProduct): IProduct {
    return {
      id: dbObject.id,
      uid: dbObject._id,
      title: dbObject.title,
      price: dbObject.price,
    };
  }
  private calculateSkip(page: number, size: number) {
    return ((page || 1) - 1) * size;
  }
}
