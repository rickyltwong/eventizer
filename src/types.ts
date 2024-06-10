export interface EventAddress {
  venueName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
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
  discountType: string;
  discountApplicable: string;
  discountExpiry: Date;
}

export interface Event {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventAddress: EventAddress;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  instructorName: string;
  eventType: string;
  capacity: number;
  remainingSeats: number;
  markedPrice: number;
  currency: string;
  difficulty: string;
  minimumAge: number;
  ticketsClasses: TicketClass[];
  discounts: Discount[];
}
