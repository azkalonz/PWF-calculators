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
  mortgage_data?: MortgageData[];
}

class Mortgage implements IMortgage {
  public summary: MortgageSummary;
  public mortgage_data?: MortgageData[] | undefined;

  constructor(summary: MortgageSummary) {
    this.summary = summary;
  }

  getPaymentFrequency() {
    return parseInt(this.summary.payment_frequency);
  }

  getNumberOfPayments(includeExtraPayments: boolean = false) {
    if (includeExtraPayments) {
      return Math.round(
        NPER(
          this.summary.annual_interest_rate / this.getPaymentFrequency(),
          this.getPayments() +
            this.getPIAWeeklyCashflow(1) +
            this.summary.client_extra_payments_per_period,
          -this.summary.loan_amount
        )
      );
    } else {
      return this.summary.term_of_loan_in_years * this.getPaymentFrequency();
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
      this.summary.annual_interest_rate / this.getPaymentFrequency(),
      this.summary.term_of_loan_in_years * this.getPaymentFrequency(),
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
    return _.round((this.summary.annual_interest_rate / this.getPaymentFrequency()) * balance, 2);
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

  getTotalPayments() {
    if (!this.mortgage_data) {
      return 0;
    } else {
      return _.round(_.sumBy(this.mortgage_data, 'payment'), 2);
    }
  }

  calculateFromTerm() {
    if (!this.mortgage_data) return [];
    const mortgageTable: MortgageData[] = [];
    let currentBalance = this.summary.loan_amount;
    let staggerBy = this.getNumberOfPayments(true) / this.getPaymentFrequency();
    const perBatch = this.getPaymentFrequency();
    let index = 0;

    while (staggerBy > 0) {
      const batch = this.mortgage_data.slice(index * perBatch, (index + 1) * perBatch);
      let interest = _.sumBy(batch, 'interest');
      let principal = _.sumBy(batch, 'principal');
      let payment = _.sumBy(batch, 'payment');
      let theBalance = index > 1 ? mortgageTable[index - 1].balance : currentBalance;
      let balance = _.round(theBalance - principal, 2);

      mortgageTable.push({
        year: index + 1,
        balance,
        interest,
        principal,
        previousBalance: currentBalance,
        payment,
      });

      currentBalance = balance;
      index++;
      staggerBy--;
    }
    return mortgageTable;
  }

  calculate() {
    const mortgageTable: MortgageData[] = [];
    let currentBalance = this.summary.loan_amount;
    let index = 0;

    while (currentBalance > 0) {
      let theBalance = index > 1 ? mortgageTable[index - 1].balance : currentBalance;
      let interest = this.getInterest(theBalance);
      let principal = this.getPrincipal(interest);
      let balance = _.round(theBalance - principal, 2);
      let payment = this.getPayments() + this.summary.client_extra_payments_per_period;

      if (this.summary.income_generating_years[0] != 0) {
        payment += this.getPIAWeeklyCashflow(1);
      }

      mortgageTable.push({
        year: index + 1,
        interest,
        principal,
        balance,
        payment,
        previousBalance: currentBalance,
      });

      currentBalance = balance;
      index++;
    }
    this.mortgage_data = mortgageTable;
    return mortgageTable;
  }
}

export default Mortgage;
