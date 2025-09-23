import {Response, Router, type Request} from 'express';
import {IClubInputBodyModel, IClubInputModel} from '../models/clubInputModel';
import {body, checkSchema, query} from 'express-validator';
import {inputValidationMiddleware} from '../middlewares';
import {authMiddleware} from '../middlewares';
import {ProductService} from '../domain';
import {IProductInputModel} from '../models/productInputModel';

export const getProductRoutes = () => {
  const productsRouter = Router();
  const productsService = new ProductService();

  productsRouter
    .get('/', async (req: Request<{}, {}, {}, IProductInputModel>, res) => {
      const allProducts = await productsService.findProducts(req.query);
      res.send(allProducts);
    })
    .get('/:id', async (req: Request<{id: string}>, res) => {
      const foundProduct = await productsService.findProductById(
        +req.params.id
      );
      if (!foundProduct) {
        res.sendStatus(404);
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
        console.log(req.user);
        debugger;
        const createdProduct = await productsService.createProduct(
          req.body,
          req.user!._id
        );
        if (!createdProduct) {
          res.sendStatus(400);
          return;
        }
        res.status(201).send(createdProduct);
      }
    );
  return productsRouter;
};
