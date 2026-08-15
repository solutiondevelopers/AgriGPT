import { Request, Response } from 'express';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { items, totalAmount, deliveryDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      deliveryDetails,
      status: 'Processing'
    });

    await order.save();
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await Order.find({ userId } as any).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
