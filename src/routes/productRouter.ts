import {Response, Router, type Request} from 'express';
import {checkSchema} from 'express-validator';
import {IProductInputBodyModel, IProductInputModel} from '../models';
import {authMiddleware, inputValidationMiddleware} from '../middlewares';
import {ProductService} from '../domain';
import {HTTP_STATUSES} from '../constants';

export const getProductRoutes = () => {
    const productsRouter = Router();
    const productsService = new ProductService();

    productsRouter
        .get('/', async (req: Request<{}, {}, {}, IProductInputModel>, res) => {
            const allProducts = await productsService.findProducts(req.query);

            res.send({
                ...allProducts,
                deviceName: req.get('User-Agent'),
            });
        })
        .get('/:uid', async (req: Request<{ uid: string }>, res) => {
            const foundProduct = await productsService.findProductByUId(
                req.params.uid
            );
            if (!foundProduct) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(foundProduct);
        })
        .post(
            '/',
            authMiddleware,
            checkSchema({
                title: {
                    trim: true,
                    isString: true,
                    isLength: {options: {min: 3, max: 30}},
                    errorMessage: {message: 'Title should be from 3 to 30 characters'},
                },
                price: {
                    optional: true,
                    isFloat: {options: {min: 0}},
                    errorMessage: {message: 'Price should be a positive number'},
                },
            }),
            inputValidationMiddleware,
            async (req: Request<{}, {}, IProductInputBodyModel>, res: Response) => {
                const createdProduct = await productsService.createProduct(
                    req.body,
                    req.user!._id
                );
                if (!createdProduct) {
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                }
                res.send(createdProduct);
            }
        );
    return productsRouter;
};
