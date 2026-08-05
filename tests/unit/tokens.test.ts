import { describe, expect, it } from "vitest";
import { theme } from "@/constants/theme";
import { LINKS } from "@/constants/links";
import { BREAKPOINT_EVENT } from "@/constants/event-content";

describe("design tokens + content wiring", () => {
  it("uses the light Breakpoint accent purple", () => {
    expect(theme.colors.brand50).toBe("#6D5BD0");
    expect(theme.colors.background.toUpperCase()).toBe("#F4F2FA");
  });

  it("keeps venue maps place_id exact", () => {
    expect(LINKS.venue.mapsSearch).toContain(
      "query_place_id=ChIJ3bLAyY0PdkgRmS_wQBMJ-iY",
    );
  });

  it("keeps ticket price at $550.00", () => {
    expect(BREAKPOINT_EVENT.ticket.displayPrice).toBe("$550.00");
    expect(BREAKPOINT_EVENT.ticket.priceUsd).toBe(550);
  });
});
