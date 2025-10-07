import {Response, Router, type Request} from 'express';
import {body, checkSchema, query} from 'express-validator';
import {IClubInputBodyModel, IProductInputModel} from '../models';
import {authMiddleware, inputValidationMiddleware} from '../middlewares';
import {ProductService} from '../domain';
import {HTTP_STATUSES} from '../constants/httpStatuses';

export const getProductRoutes = () => {
  const productsRouter = Router();
  const productsService = new ProductService();

  productsRouter
    .get('/', async (req: Request<{}, {}, {}, IProductInputModel>, res) => {
      const allProducts = await productsService.findProducts(req.query);
      console.log(req.get('User-Agent'));

      res.send({
        ...allProducts,
        deviceName: req.get('User-Agent'),
      });
    })
    .get('/:id', async (req: Request<{id: string}>, res) => {
      const foundProduct = await productsService.findProductById(
        +req.params.id
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
      // checkSchema({
      //   name: {
      //     trim: true,
      //     isLength: {options: {min: 3, max: 30}},
      //     isString: true,
      //     errorMessage: {message: 'Name should be from 3 to 30 characters'},
      //   },
      //   url: {
      //     trim: true,
      //     isURL: true,
      //     errorMessage: {message: 'Url should be correct'},
      //   },
      // }),
      inputValidationMiddleware,
      async (req: Request<{}, IClubInputBodyModel>, res: Response) => {
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
