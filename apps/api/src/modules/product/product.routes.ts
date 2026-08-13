import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware.js';

import { productController } from './product.controller.js';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema,
} from './product.schema.js';

export const productRouter = Router();

productRouter.post('/', validate(createProductSchema), productController.create);

productRouter.get('/', validate(listProductsSchema), productController.list);

productRouter.get('/:id', validate(getProductSchema), productController.getById);

productRouter.patch('/:id', validate(updateProductSchema), productController.update);

productRouter.delete('/:id', validate(deleteProductSchema), productController.delete);
