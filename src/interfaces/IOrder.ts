import { Types } from 'mongoose';

export interface IOrder {
  _id?: Types.ObjectId;
  userId: string;
  items: {
    itemId: Types.ObjectId;
    quantity: number;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'packing' | 'delivering' | 'delivered' | 'cancelled';
  deliveryPersonId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
