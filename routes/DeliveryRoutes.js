import express from 'express';
import {
  addDelivery,
  editDelivery,
  deleteDelivery,
  getAllDeliveries,
  getUniqueCountriesCount
} from '../controllers/DeliveryController.js';

const deliveryRouter = express.Router();

// Route for adding a new delivery
deliveryRouter.post('/', addDelivery);

// route for getting country number
deliveryRouter.get('/country', getUniqueCountriesCount);

// Route for editing a delivery
deliveryRouter.patch('/', editDelivery);

// Route for deleting a delivery
deliveryRouter.delete('/', deleteDelivery);

// Route for getting all deliveries
deliveryRouter.get('/', getAllDeliveries);

export default deliveryRouter;