export interface IEventAddress {
  venueName: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
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

export interface EventFormValues {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventAddress: {
    venueName: string;
    addressLine1: string;
  };
  eventStartDateTime: Date | null;
  eventEndDateTime: Date | null;
  instructorName: string;
  eventType: string;
  capacity: number;
  difficulty: string;
  minimumAge: number;
  ticketTypes: string[];
  image: string;

}

export type EventFormAddress = Required<IEventAddress>;

export type FormTicketClass = Partial<TicketClass>;

export type FormDiscount = Partial<Discount>;



export { IEvent, IEventAddress, TicketClass, Discount, EventFormValues };
