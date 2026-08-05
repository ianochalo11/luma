import { LINKS } from "@/constants/links";
import type { Event } from "@/types/event";

/**
 * Hard-coded Breakpoint 2026 page content — keep components free of inline copy.
 */

export const DEMO_USER = {
  id: "usr-demo-joseph",
  name: "Joseph Wamiti",
  firstName: "Joseph",
  email: "josephwamiti8711@gmail.com",
  image: null as string | null,
} as const;

export const BREAKPOINT_EVENT: Event = {
  slug: "breakpoint2026",
  apiId: "evt-KFDtoSxKwrXxRwQ",
  title: "Solana Breakpoint 2026",
  presentedBy: {
    name: "Solana Breakpoint",
    href: LINKS.presentedBy.calendar,
    avatarUrl: LINKS.assets.calendarAvatar,
  },
  host: {
    name: "Solana Foundation",
    href: LINKS.host.profile,
    avatarUrl: LINKS.assets.hostAvatar,
  },
  tags: [
    { label: "Crypto", href: LINKS.tags.crypto },
    { label: "Featured in London", href: LINKS.tags.featuredInLondon },
  ],
  schedule: {
    dateTile: { month: "Nov", day: "15" },
    weekdayLine: "Sunday, November 15",
    timeRangeLine: "4:00 PM - Nov 17, 7:00 PM GMT",
    startAt: "2026-11-15T16:00:00.000Z",
    endAt: "2026-11-17T19:00:00.000Z",
    timezone: "Europe/London",
  },
  venue: {
    name: "Olympia",
    cityLine: "London, United Kingdom",
    fullAddress: "Olympia, Hammersmith Rd, London W14 8UX, UK",
    streetLine: "Hammersmith Rd, London W14 8UX, UK",
    mapsHref: LINKS.venue.mapsSearch,
    mapsPreviewHref: LINKS.venue.mapsPreview,
    latitude: 51.4963566,
    longitude: -0.2107637,
  },
  ticket: {
    priceUsd: 550,
    currencyLabel: "USD",
    displayPrice: "$550.00",
    paymentMethodLabel: "USDC on Solana",
  },
  coverUrl: LINKS.assets.coverImage,
  socialImageUrl: LINKS.assets.socialImage,
  about: {
    paragraphs: [
      "Breakpoint 2026 brings together the leaders, builders, investors, institutions, and creators shaping the future of the Solana ecosystem. Designed as a high-signal gathering, the event creates space for meaningful connections, new ideas, and the unveiling of products and technologies pushing the network forward. Attendees will experience a curated program of keynotes, lightning talks, debates, workshops, and networking designed to spark collaboration and accelerate the next phase of growth across the ecosystem.",
      "Breakpoint 2026 will take place November 15 -17 at Olympia London, bringing the global Solana community to one of the world’s most influential financial centers. London sits at the intersection of global capital. It is where money is accumulated, structured, legitimized, and redeployed, home to family offices, sovereign wealth funds, hedge funds, commodity traders, private credit firms, insurers, and the legal and financial infrastructure that connects markets across continents.",
      "London sits at the intersection of global capital. Winning London means gaining distribution across Europe, the Middle East, Africa, and beyond - making it the ideal stage for the next chapter of Solana’s growth.",
    ],
    closingPrefix: "For more information, check out ",
    closingLinkLabel: "solana.com/breakpoint",
    closingLinkHref: LINKS.about.solanaBreakpointWithUtm,
  },
  ctas: {
    getTickets: "Get Tickets",
    getTicket: "Get Ticket",
    follow: "Follow",
    contactHost: "Contact the Host",
    reportEvent: "Report Event",
    accessCodePrompt: "Have an access code? You can enter it here.",
  },
  welcome: {
    signedOut: "Sign in to get your ticket below.",
    signedInTemplate:
      "Welcome, {firstName}! To join the event, please get your ticket below.",
  },
  meta: {
    presentedByLabel: "Presented by",
    hostedByLabel: "Hosted By",
    aboutHeading: "About Event",
    locationHeading: "Location",
    ticketPriceLabel: "Ticket Price",
    getTicketsHeading: "Get Tickets",
  },
};

export const FOOTER_NAV_LINKS = [
  { label: "Discover", href: LINKS.site.discover },
  { label: "Pricing", href: LINKS.site.pricing },
  { label: "Help", href: LINKS.site.help },
] as const;

/** @deprecated use FOOTER_NAV_LINKS + app CTA separately */
export const FOOTER_LINKS = [
  ...FOOTER_NAV_LINKS,
  { label: "Get the App", href: LINKS.site.app },
] as const;

export const REGISTRATION_COPY = {
  pageTitle: "Register",
  yourInfoHeading: "Your Info",
  fields: {
    name: {
      label: "Name",
      placeholder: "Your Name",
      required: true,
    },
    email: {
      label: "Email",
      placeholder: "you@email.com",
      required: true,
    },
    legalName: {
      label: "Legal Name (as shown on ID)",
      helper:
        "this will only be used for badge pick-up verification and will not be printed on your badge",
      required: true,
    },
    company: {
      label: "What company do you work for?",
      helper: "This will be printed on your badge",
      required: true,
    },
    jobTitle: {
      label: "What's your job title?",
      required: false,
    },
    country: {
      label: "What country are you based in?",
      required: true,
    },
    city: {
      label: "What city are you located in?",
      required: false,
    },
    github: {
      label: "What is your Github username?",
      required: false,
    },
    ecosystemTenure: {
      label: "How long have you participated in the Solana ecosystem?",
      required: true,
      options: [
        "Less than 6 months",
        "6 months–1 year",
        "1–2 years",
        "2+ years",
      ] as const,
    },
    categories: {
      label: "Which category does your product/service fall under?",
      helper: "Select one or more",
      required: true,
      options: [
        "DeFi",
        "NFTs",
        "Infrastructure",
        "Gaming",
        "DePIN",
        "Payments",
        "Tooling",
        "Other",
      ] as const,
    },
    tshirtSize: {
      label: "What is your t-shirt size (unisex)?",
      required: false,
      options: ["XS", "S", "M", "L", "XL", "XXL"] as const,
    },
  },
  agreements: {
    terms: {
      label: "I agree to the Terms and Conditions of the event",
      href: LINKS.registration.termsAndConditions,
    },
    codeOfConduct: {
      label: "I agree to abide by the Solana Foundation Code of Conduct",
      href: LINKS.registration.codeOfConduct,
    },
    nonRefundable: {
      label:
        "I understand this ticket is non-refundable, but it is transferable in case I can no longer attend.",
    },
  },
} as const;

export const PAYMENT_COPY = {
  heading: "Payment",
  methodLabel: "Payment method",
  methodValue: "USDC on Solana",
  payWithWallet: "Pay with Wallet",
  orderSummary: "Order summary",
  ticketLine: "Breakpoint 2026 Ticket",
  accessCodeDiscount: "Access code",
  total: "Total",
  addCoupon: "Add a coupon",
} as const;
