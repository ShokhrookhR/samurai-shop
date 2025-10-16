import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {IProduct} from '../types';
import {ProductModel} from './db';
import {OptionalId} from 'mongodb';

export class ProductRepository {
    private model: typeof ProductModel;


    constructor() {
        this.model = ProductModel;
    }

    async findProducts(
        query: IProductInputModel
    ): Promise<IProductViewModel<IProduct>> {
        const filter: any = {};

        if (query.title) {
            filter.title = {$regex: query.title};
        }
        const productsCount = await this.model.countDocuments();

        const productsFromDB = await this.model
            .find(filter)
            .sort({title: query.sortBy === 'asc' ? 1 : -1})
            .skip(this.calculateSkip(+query.page, +query.size))
            .limit(+query.size)
            .lean();
        const mappedProducts = productsFromDB.map((product) => {
            return this.mapToProduct(product);
        });


        return {
            data: mappedProducts,
            totalCount: productsCount,
        };
    }

    async findProductByUId(uid: string): Promise<IProduct | null> {
        return this.model.findOne({_id: uid});
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
        await this.model.insertOne(insertDoc);

        return insertDoc;
    }

    private mapToProduct(dbObject: any): IProduct {
        return {
            id: dbObject.id,
            uid: dbObject._id,
            title: dbObject.title,
            price: dbObject.price,
        };
    }

    private calculateSkip(page: number, size: number): number {
        return ((page || 1) - 1) * size;
    }
}
