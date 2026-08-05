/**
 * Single source of truth for every external / cross-page URL used by the clone.
 * Sampled from https://luma.com/breakpoint2026 plus the registration brief URLs.
 */

const LUMA = "https://luma.com" as const;

export const LINKS = {
  event: {
    page: `${LUMA}/breakpoint2026`,
    slug: "breakpoint2026",
  },

  presentedBy: {
    calendar: `${LUMA}/breakpoint?k=c`,
    twitter: "https://x.com/solanaevents",
    youtube: "https://youtube.com/@SolanaFndn",
    website: "https://solana.com/breakpoint?utm_source=luma",
  },

  host: {
    profile: `${LUMA}/user/usr-LeXQZYBGv26yBfK`,
    name: "Solana Foundation",
  },

  tags: {
    crypto: `${LUMA}/crypto`,
    featuredInLondon: `${LUMA}/london?k=p`,
  },

  venue: {
    /** Exact place_id link from the hero location row */
    mapsSearch:
      "https://www.google.com/maps/search/?api=1&query=Olympia&query_place_id=ChIJ3bLAyY0PdkgRmS_wQBMJ-iY",
    /** Coordinate + place_id variant used by the map preview */
    mapsPreview:
      "https://www.google.com/maps/search/?api=1&query=51.4963566%2C-0.2107637&query_place_id=ChIJ3bLAyY0PdkgRmS_wQBMJ-iY",
    /** Google Maps embed (no API key) — Olympia London */
    mapsEmbed:
      "https://www.google.com/maps?q=Olympia,+Hammersmith+Rd,+London+W14+8UX,+UK&hl=en&z=15&output=embed",
  },

  nav: {
    events: `${LUMA}/home`,
    calendars: `${LUMA}/calendar`,
    discover: `${LUMA}/discover`,
    createEvent: `${LUMA}/create`,
  },

  about: {
    solanaBreakpoint: "https://solana.com/breakpoint",
    solanaBreakpointWithUtm: "https://solana.com/breakpoint?utm_source=luma",
  },

  registration: {
    termsAndConditions: "https://rb.gy/ogvlgm",
    codeOfConduct: "https://shorturl.at/lEMR1",
  },

  site: {
    home: LUMA,
    discover: `${LUMA}/discover`,
    pricing: `${LUMA}/pricing`,
    help: "https://help.luma.com",
    app: `${LUMA}/app`,
    signIn: "/sign-in",
    signUp: "/sign-up",
    profile: "/profile",
    settings: "/settings",
  },

  social: {
    lumaInstagram: "https://www.instagram.com/luma_hq/",
    lumaX: "https://x.com/LumaHQ",
    lumaSupportEmail: "mailto:support@luma.com",
  },

  assets: {
    coverImage:
      "https://images.lumacdn.com/event-covers/rp/f80e679e-441f-4cd0-9f62-ffb131cf68bb.png",
    socialImage:
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,anim=false,background=white,quality=75,width=800,height=420/event-social/77/5f85eba4-4c90-4885-9628-5172bb52c142.png",
    calendarAvatar:
      "https://images.lumacdn.com/calendars/kd/ac61709f-bc4b-4752-ade1-5a1445314d54.png",
    hostAvatar:
      "https://images.lumacdn.com/avatars/mc/6896df12-a63d-4542-af30-6fac14b038ab",
    londonIcon:
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=%23e89800,quality=75,width=22.5,height=22.5/discovery/london-icon.png",
  },

  appRoutes: {
    landing: "/breakpoint2026",
    register: "/event/breakpoint2026/register",
    /** Payment is on the registration page */
    checkout: "/event/breakpoint2026/register",
  },
} as const;

export type Links = typeof LINKS;
