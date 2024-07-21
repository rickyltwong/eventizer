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
  eventName: string;
  eventDescription: string;
  eventAddress: IEventAddress;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  instructorName: string;
  eventType: 'Yoga' | 'Meditation' | 'Fitness' | string;
  capacity: number;
  markedPrice: number;
  currency: 'CAD' | string;
  difficulty: string;
  minimumAge?: number;
  ticketTypes: string[];
  image: string;
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

export type TicketStatus = 'Pending' | 'Pre-Sale' | 'Available' | 'Sold' | 'Cancelled' | string;

export type Ticket = {
  event: string;
  type: string;
  markedPrice?: number;
  price?: number;
  discount?: number;
  discountExpiry?: string;
  status: TicketStatus;
  sold: number;
  
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
