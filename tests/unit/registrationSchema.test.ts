import { describe, expect, it } from "vitest";
import { registrationSchema } from "@/lib/validation/registrationSchema";

const validBase = {
  name: "Joseph Wamiti",
  email: "josephwamiti8711@gmail.com",
  legalName: "Joseph Wamiti",
  company: "Independent",
  jobTitle: "Engineer",
  country: "Kenya",
  city: "Nairobi",
  github: "joseph",
  ecosystemTenure: "1–2 years",
  categories: ["DeFi", "Tooling"],
  tshirtSize: "L",
  agreeTerms: true,
  agreeCodeOfConduct: true,
  agreeNonRefundable: true,
};

describe("registrationSchema", () => {
  it("accepts a complete valid payload", () => {
    const result = registrationSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("requires name, email, legal name, company, country, tenure, categories, and agreements", () => {
    const result = registrationSchema.safeParse({
      ...validBase,
      name: "",
      email: "not-an-email",
      legalName: "",
      company: "",
      country: "",
      ecosystemTenure: "",
      categories: [],
      agreeTerms: false,
      agreeCodeOfConduct: false,
      agreeNonRefundable: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toEqual(
        expect.arrayContaining([
          "name",
          "email",
          "legalName",
          "company",
          "country",
          "ecosystemTenure",
          "categories",
          "agreeTerms",
          "agreeCodeOfConduct",
          "agreeNonRefundable",
        ]),
      );
    }
  });

  it("allows optional fields to be empty", () => {
    const result = registrationSchema.safeParse({
      ...validBase,
      jobTitle: "",
      city: "",
      github: "",
      tshirtSize: "",
    });
    expect(result.success).toBe(true);
  });
});
