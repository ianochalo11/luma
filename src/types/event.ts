export interface EventTag {
  label: string;
  href: string;
}

export interface EventHost {
  name: string;
  href: string;
  avatarUrl: string;
}

export interface EventSchedule {
  dateTile: { month: string; day: string };
  weekdayLine: string;
  timeRangeLine: string;
  startAt: string;
  endAt: string;
  timezone: string;
}

export interface EventVenue {
  name: string;
  cityLine: string;
  fullAddress: string;
  streetLine: string;
  mapsHref: string;
  mapsPreviewHref: string;
  latitude: number;
  longitude: number;
}

export interface TicketTier {
  priceUsd: number;
  currencyLabel: string;
  displayPrice: string;
  paymentMethodLabel: string;
}

export interface EventAbout {
  paragraphs: string[];
  closingPrefix: string;
  closingLinkLabel: string;
  closingLinkHref: string;
}

export interface Event {
  slug: string;
  apiId: string;
  title: string;
  presentedBy: EventHost;
  host: EventHost;
  tags: EventTag[];
  schedule: EventSchedule;
  venue: EventVenue;
  ticket: TicketTier;
  coverUrl: string;
  socialImageUrl: string;
  about: EventAbout;
  ctas: {
    getTickets: string;
    getTicket: string;
    follow: string;
    contactHost: string;
    reportEvent: string;
    accessCodePrompt: string;
  };
  welcome: {
    signedOut: string;
    signedInTemplate: string;
  };
  meta: {
    presentedByLabel: string;
    hostedByLabel: string;
    aboutHeading: string;
    locationHeading: string;
    ticketPriceLabel: string;
    getTicketsHeading: string;
  };
}
