import { NPER, PMT } from '../utils/excelFormulas';
import { clamp } from '../utils/numbers';
import {
  ListOfPIAForecast,
  MortgageData,
  MortgageSummary,
  PIAForecast,
  PIAForecastData,
} from './types';
import _ from 'lodash-es';

interface IMortgage {
  summary: MortgageSummary;
}

class Mortgage implements IMortgage {
  public summary: MortgageSummary;
  constructor(summary: MortgageSummary) {
    this.summary = summary;
  }

  getNumberOfPayments(includeExtraPayments: boolean = false) {
    if (includeExtraPayments) {
      return Math.round(
        NPER(
          this.summary.annual_interest_rate / this.summary.payment_frequency,
          this.getPayments() +
            this.getPIAWeeklyCashflow(1) +
            this.summary.client_extra_payments_per_period,
          -this.summary.loan_amount
        )
      );
    } else {
      return this.summary.term_of_loan_in_years * this.summary.payment_frequency;
    }
  }

  getPIAForecast(year: number = 1): PIAForecast {
    const y = `YEAR${year}`;
    const after_tax_cashflow = PIAForecastData[y as keyof typeof PIAForecastData];
    return {
      year,
      after_tax_cashflow,
      after_tax_weekly_cash_flow: after_tax_cashflow / 52,
    };
  }

  getPayments() {
    return -PMT(
      this.summary.annual_interest_rate / this.summary.payment_frequency,
      this.summary.term_of_loan_in_years * this.summary.payment_frequency,
      this.summary.loan_amount
    );
  }

  getPIAWeeklyCashflow(year: number = 1) {
    let total = 0;
    const PWyears: ListOfPIAForecast = [];
    for (let i = 0; i < 16; i++) {
      PWyears[i] = this.getPIAForecast(i + 1);
    }
    const cashflowToCount = PWyears.slice(year < 5 ? 0 : year - 5, year).map(
      (q) => q.after_tax_weekly_cash_flow
    );
    cashflowToCount.forEach((val, index) => {
      total +=
        ((val * 52) / 12) *
        this.summary.income_generating_years.slice(0, clamp(year, 0, 5)).reverse()[index];
    });

    return total;
  }

  getInterest(balance: number) {
    return _.round(
      (this.summary.annual_interest_rate / this.summary.payment_frequency) * balance,
      2
    );
  }

  getPrincipal(interest: number) {
    return _.round(
      this.getPayments() +
        this.summary.client_extra_payments_per_period +
        this.getPIAWeeklyCashflow(1) -
        interest,
      2
    );
  }

  calculate() {
    const mortgageRow: MortgageData[] = [];
    let currentBalance = this.summary.loan_amount;
    let index = 0;

    while (currentBalance > 0) {
      let theBalance = index > 1 ? mortgageRow[index - 1].balance : currentBalance;
      let interest = this.getInterest(theBalance);
      let principal = this.getPrincipal(interest);
      let balance = _.round(theBalance - principal, 2);

      mortgageRow.push({
        year: index + 1,
        interest,
        principal,
        balance,
        payment: 123,
        previousBalance: currentBalance,
      });

      currentBalance = balance;
      index++;
    }
    return mortgageRow;
  }
}

export default Mortgage;
