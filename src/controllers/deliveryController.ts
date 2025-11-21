import { Request, Response } from 'express';

import { DeliveryRequest } from '../models/common';
import { DeliveryService } from '../services/DeliveryService';

const deliveryService = new DeliveryService();

export const getDeliveryOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const request: DeliveryRequest = {
      cart: req.body.cart,
      address: req.body.address,
    };

    // Валидация
    if (!request.cart || !request.address) {
      res.status(400).json({
        error: 'Invalid request format',
        details: 'Cart and address are required',
      });
      return;
    }

    const response = await deliveryService.getDeliveryOptions(request);

    res.json(response);
  } catch (error) {
    console.error('Delivery controller error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'Failed to get delivery options',
    });
  }
};
