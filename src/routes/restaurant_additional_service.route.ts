import express from 'express';
import { getRestaurantAdditionalServices, createRestaurantAdditionalService } from '../controllers/restaurant_additional_service.controller';


const router = express.Router({ mergeParams: true });
router.route('/').get(getRestaurantAdditionalServices).post(createRestaurantAdditionalService);

export default router;