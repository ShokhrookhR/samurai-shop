import {IProductViewModel} from '../models';
import {IProductInputModel} from '../models/productInputModel';
import {ProductRepository} from '../repositories/productRepository';
import {IProduct} from '../types';
import {ObjectId} from 'mongodb';

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

    async findProductByUId(uid: string): Promise<IProduct | null> {
        return await this.repository.findProductByUId(uid);
    }

    async createProduct(
        payload: IProduct,
        userId: ObjectId
    ): Promise<IProduct | null> {
        return await this.repository.createProduct(payload, userId);
    }
}
