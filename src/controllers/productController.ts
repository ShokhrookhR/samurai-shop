import {Request, Response} from 'express';
import {ProductService} from '../domain';
import {IProductInputBodyModel, IProductInputModel} from '../models';
import {HTTP_STATUSES} from '../constants';

export class ProductController {
    constructor() {
        this.service = new ProductService();
    }

    private readonly service: ProductService;

    getProducts = async (
        req: Request<{}, {}, {}, IProductInputModel>,
        res: Response
    ) => {
        const allProducts = await this.service.findProducts(req.query);

        res.send({
            ...allProducts,
            deviceName: req.get('User-Agent'),
        });
    };

    getProductByUId = async (req: Request<{uid: string}>, res: Response) => {
        const foundProduct = await this.service.findProductByUId(req.params.uid);
        if (!foundProduct) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.send(foundProduct);
    };

    createProduct = async (
        req: Request<{}, {}, IProductInputBodyModel>,
        res: Response
    ) => {
        const createdProduct = await this.service.createProduct(
            req.body,
            req.user!._id
        );
        if (!createdProduct) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        res.send(createdProduct);
    };
}
