import { FuzzyDate as AniFuzzyDate } from "~/__generated__/graphql";

export class FuzzyDate {
  /** Numeric Day (24) */
  day: number;
  /** Numeric Month (3) */
  month: number;
  /** Numeric Year (2017) */
  year: number;

  constructor() {
    // Initialize with new Date()
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
  }

  fromDate(date: Date) {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    return this;
  }

  toDate() {
    return new Date(this.year, this.month - 1, this.day);
  }

  fromFuzzy(date: AniFuzzyDate) {
    !!date.year && (this.year = date.year);
    !!date.month && (this.month = date.month);
    !!date.day && (this.day = date.day);
    return this;
  }

  toFuzzy() {
    return {
      ...this,
    } as AniFuzzyDate;
  }
}
