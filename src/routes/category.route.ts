import express from 'express';
import { createCategory, getCategories } from '../controllers/category.controller';
import itemRouter from './item.route';

const router = express.Router( { mergeParams: true } );
router.use("/:categoryId/items", itemRouter);
router.route('/').get(getCategories).post(createCategory);
export default router;