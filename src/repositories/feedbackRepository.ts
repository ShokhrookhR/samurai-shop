import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {IProduct, IDBProduct} from '../types';
import {feedbackCollection} from './db';
import {OptionalId, WithId} from 'mongodb';
export class FeedbackRepository {
  constructor() {
    this.collection = feedbackCollection;
  }
  private collection;

  // async findProducts(
  //   query: IProductInputModel
  // ): Promise<IProductViewModel<IProduct>> {
  //   const filter: any = {};

  //   if (query.title) {
  //     filter.title = {$regex: query.title};
  //   }
  //   const productsCount = await this.collection.countDocuments();
  //   const productsFromDB = await this.collection
  //     .find(filter)
  //     .sort({title: query.sortBy === 'asc' ? 1 : -1})
  //     .skip(this.calculateSkip(+query.page, +query.size))
  //     .limit(+query.size)
  //     .toArray();
  //   const mappedProducts = productsFromDB.map((product) => {
  //     return this.mapToProduct(product);
  //   });

  //   const responseBody = {
  //     data: mappedProducts,
  //     totalCount: productsCount,
  //   };

  //   return responseBody;
  // }
  // async findProductById(id: number): Promise<IProduct | null> {
  //   const foundProduct = await this.collection.findOne({id});

  //   return foundProduct;
  // }
  // async createProduct(
  //   newProduct: IProduct,
  //   userId: string
  // ): Promise<IProduct | null> {
  //   const insertDoc: OptionalId<any> = {
  //     id: newProduct.id,
  //     title: newProduct.title,
  //     price: newProduct.price,
  //     userId,
  //   };
  //   await this.collection.insertOne(insertDoc);

  //   return newProduct;
  // }
  // private mapToProduct(dbObject: IDBProduct): IProduct {
  //   return {
  //     id: dbObject.id,
  //     uid: dbObject._id,
  //     title: dbObject.title,
  //     price: dbObject.price,
  //   };
  // }
  private calculateSkip(page: number, size: number) {
    return ((page || 1) - 1) * size;
  }
  async addFeedback(message: string, userId: string) {
    const insertDoc: OptionalId<any> = {
      message,
      userId,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(insertDoc);
    if (!result.acknowledged) {
      return null;
    }
    return insertDoc;
  }
}
