import { IEvent } from './event';

export type Id = string | number;

export type KanbanColumn = {
  id: Id;
  title: string;
};

export type KanbanTask = {
  id: Id;
  columnId: Id;
  content: string;
  title?: string;
  status?: 'to do' | 'in progress' | 'done' | 'unassigned' | string;
  comments?: number;
  users?: number;
};

export type TicketStatus =
  | 'Pending'
  | 'Pre-Sale'
  | 'Available'
  | 'Sold'
  | 'Cancelled'
  | string;

export type Ticket = {
  _id: Id;
  event: IEvent;
  type: string;
  markedPrice?: number;
  price?: number;
  discount?: number;
  discountExpiry?: string;
  status: TicketStatus;
  sold: number;
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
