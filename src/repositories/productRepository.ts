import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {IProduct} from '../types';
import {ProductModel} from './db';
import {ObjectId} from 'mongodb';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export class ProductRepository {
    private model: typeof ProductModel;


    constructor() {
        this.model = ProductModel;
    }

    async findProducts(
        query: IProductInputModel
    ): Promise<IProductViewModel<IProduct>> {
        const filter: Record<string, unknown> = {};

        if (query.title) {
            filter.title = {$regex: this.escapeRegex(query.title), $options: 'i'};
        }
        const page = this.toPositiveInt(query.page, 1);
        const size = Math.min(this.toPositiveInt(query.size, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

        const productsCount = await this.model.countDocuments(filter);

        const productsFromDB = await this.model
            .find(filter)
            .sort({title: query.sortBy === 'asc' ? 1 : -1})
            .skip((page - 1) * size)
            .limit(size)
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
        if (!ObjectId.isValid(uid)) {
            return null;
        }
        const product = await this.model.findById(uid).lean();
        return product ? this.mapToProduct(product) : null;
    }

    async createProduct(
        newProduct: IProduct,
        userId: ObjectId
    ): Promise<IProduct | null> {
        const createdProduct = await this.model.create({
            title: newProduct.title,
            price: newProduct.price,
            userId,
        });

        return this.mapToProduct(createdProduct);
    }

    private mapToProduct(dbObject: {_id: unknown; title: string; price: number}): IProduct {
        return {
            uid: String(dbObject._id),
            title: dbObject.title,
            price: dbObject.price,
        };
    }

    private toPositiveInt(value: unknown, fallback: number): number {
        const parsed = Number(value);
        return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
    }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
