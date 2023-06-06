import express from 'express';
import { createRestaurantLocation, getRestaurantLocations } from '../controllers/restaurant_location.controller';


const router = express.Router({ mergeParams: true });
router.route('/').get(getRestaurantLocations).post(createRestaurantLocation);

export default router;