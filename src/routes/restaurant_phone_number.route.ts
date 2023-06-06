import express from 'express';
import { getRestaurantPhoneNumbers, createRestaurantPhoneNumber } from '../controllers/restaurant_phone_number.controller';


const router = express.Router({ mergeParams: true });
router.route('/').get(getRestaurantPhoneNumbers).post(createRestaurantPhoneNumber);

export default router;