export enum PIAForecastData {
  YEAR1 = 3931,
  YEAR2 = 4610,
  YEAR3 = 5217,
  YEAR4 = 5852,
  YEAR5 = 6514,
  YEAR6 = 3920,
  YEAR7 = 4640,
  YEAR8 = 5391,
  YEAR9 = 6175,
  YEAR10 = 6991,
  YEAR11 = 7843,
  YEAR12 = 8732,
  YEAR13 = 9622,
  YEAR14 = 10431,
  YEAR15 = 11307,
  YEAR16 = 12222,
}

export enum MortgagePaymentFrequency {
  MONTHLY = 12,
  FORTNIGHTLY = 24,
  WEEKLY = 48,
}

export type PIAForecast = {
  year: number;
  after_tax_cashflow: number;
  after_tax_weekly_cash_flow: number;
};

export type ListOfPIAForecast = PIAForecast[];

export type MortgageSummary = {
  loan_amount: number;
  annual_interest_rate: number;
  term_of_loan_in_years: number;
  payments_per_period?: number;
  client_extra_payments_per_period: number;
  extra_payments?: number;
  payment_frequency: MortgagePaymentFrequency;
  income_generating_years: number[];
};

export type MortgageData = {
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  year: number;
  previousBalance: number;
};
