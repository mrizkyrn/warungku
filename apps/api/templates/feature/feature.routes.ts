import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware.js';

import { featureController } from './feature.controller.js';
import {
  createFeatureSchema,
  deleteFeatureSchema,
  getFeatureSchema,
  listFeaturesSchema,
  updateFeatureSchema,
} from './feature.schema.js';

export const featureRouter = Router();

featureRouter.post('/', validate(createFeatureSchema), featureController.create);

featureRouter.get('/', validate(listFeaturesSchema), featureController.list);

featureRouter.get('/:id', validate(getFeatureSchema), featureController.getById);

featureRouter.patch('/:id', validate(updateFeatureSchema), featureController.update);

featureRouter.delete('/:id', validate(deleteFeatureSchema), featureController.delete);
