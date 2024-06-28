interface IEventAddress {
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

interface TicketClass {
  ticketType: string;
  price: number;
  benefits: string[];
  availability: number;
}

interface Discount {
  discountCode: string;
  discountAmount: number;
  discountType: "Fixed" | "Percentage" | string;
  discountApplicable: string;
  discountExpiry: string;
}

interface IEvent {
  eventName: string;
  eventDescription: string;
  eventAddress: EventAddress;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  instructorName: string;
  eventType: "Yoga" | "Meditation" | "Fitness" | string;
  capacity: number;
  remainingSeats?: number;
  markedPrice: number;
  currency: "CAD" | string;
  difficulty: string;
  minimumAge?: number;
  ticketsClasses: TicketClass[];
  discounts: Discount[];
}

export { IEvent, IEventAddress, TicketClass, Discount };
