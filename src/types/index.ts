// Events

export interface IEventAddress {
  venueName: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface TicketClass {
  ticketType: string;
  price: number;
  benefits: string[];
  availability: number;
}

export interface Discount {
  discountCode: string;
  discountAmount: number;
  discountType: 'Fixed' | 'Percentage' | string;
  discountApplicable: string;
  discountExpiry: string;
}

export interface IEvent {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventAddress: IEventAddress;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  instructorName: string;
  eventType: 'Yoga' | 'Meditation' | 'Fitness' | string;
  capacity: number;
  remainingSeats?: number;
  markedPrice: number;
  currency: 'CAD' | string;
  difficulty: string;
  minimumAge?: number;
  ticketsClasses: TicketClass[];
  discounts: Discount[];
}

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

export type OrderStatus = 'shipped' | 'processing' | 'cancelled' | string;

export type Orders = {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
};

export type InvoiceStatus =
  | 'pending'
  | 'sent'
  | 'cancelled'
  | 'approved'
  | 'suspended'
  | string;

export type Invoices = {
  id: string;
  full_name: string;
  email: string;
  address: string;
  country: string;
  status: InvoiceStatus;
  amount: number;
  issue_date: string;
  description: string;
  client_email: string;
  client_address: string;
  client_country: string;
  client_name: string;
  client_company: string;
};
