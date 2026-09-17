import {Router} from 'express';
import {checkSchema} from 'express-validator';
import {authMiddleware, inputValidationMiddleware} from '../middlewares';
import {ProductController} from '../controllers';

export const getProductRoutes = () => {
    const productsRouter = Router();
    const productController = new ProductController();

    productsRouter
        .get('/', productController.getProducts)
        .get('/:uid', productController.getProductByUId)
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
            productController.createProduct
        );
    return productsRouter;
};
