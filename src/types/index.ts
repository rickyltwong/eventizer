export type OrderStatus = 'shipped' | 'processing' | 'cancelled' | string;

export type Orders = {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

export type {
  Discount,
  EventFormValues,
  IEvent,
  IEventAddress,
  Status,
  TicketClass,
} from './event';
export type { IUser } from './user';
