import { describe, expect, it } from "vitest";
import { getAllTerms, getTermById, searchTerms } from "@/lib/glossary/load";
import type { GlossaryTerm } from "@/types/glossary";

describe("getAllTerms", () => {
  it("returns every term from the content registry", () => {
    const all = getAllTerms();
    expect(all.length).toBeGreaterThan(0);
    expect(all.map((t) => t.id)).toContain("sso");
  });
});

describe("getTermById", () => {
  it("returns the matching term", () => {
    const term = getTermById("sso");
    expect(term).toMatchObject({ id: "sso", term: "SSO", acronymFor: "Single Sign-On" });
  });

  it("returns null for an unknown id", () => {
    expect(getTermById("does-not-exist")).toBeNull();
  });
});

describe("searchTerms", () => {
  const sample: GlossaryTerm[] = [
    {
      id: "sso",
      term: "SSO",
      acronymFor: "Single Sign-On",
      definition: "Log in once, access many systems.",
    },
    {
      id: "endpoint",
      term: "Endpoint",
      definition: "A device connected to a network.",
    },
  ];

  it("returns every term for an empty query", () => {
    expect(searchTerms(sample, "")).toEqual(sample);
    expect(searchTerms(sample, "   ")).toEqual(sample);
  });

  it("matches case-insensitively on the term name", () => {
    expect(searchTerms(sample, "sso")).toEqual([sample[0]]);
    expect(searchTerms(sample, "ENDPOINT")).toEqual([sample[1]]);
  });

  it("matches on the expanded acronym", () => {
    expect(searchTerms(sample, "single sign")).toEqual([sample[0]]);
  });

  it("matches on definition text", () => {
    expect(searchTerms(sample, "connected to a network")).toEqual([sample[1]]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchTerms(sample, "nonexistent")).toEqual([]);
  });
});
