import {
  Button,
  Container,
  Grid,
  Input,
  SegmentedControl,
  Select,
  Skeleton,
  Space,
  Spoiler,
  Stack,
  Table,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import _ from 'lodash';
import { useState } from 'react';
import { Mortgage } from '../../api';
import {
  LoanView,
  MortgagePaymentFrequency,
  MortgagePaymentType,
  MortgageSummary
} from '../../api/mortgage/types';
import { dollarFormat } from '../../api/utils/numbers';
import { useScrollIntoView } from '@mantine/hooks';

export default function App() {
  const [mortgageData, setMortgateData] = useState<Mortgage>();
  const [isLoading, setIsLoading] = useState(false);
  const [loanSummaryView, setLoanSummaryView] = useState<LoanView>(LoanView.WITHOUT_EXTRA_PAYMENTS);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: -60,
  });

  const form = useForm({
    initialValues: {
      loan_amount: 0,
      payment_frequency: MortgagePaymentFrequency.MONTHLY.toString(),
      term_of_loan_in_years: 0,
      annual_interest_rate: 0,
      client_extra_payments_per_period: 0,
      income_generating_years: [0, 0, 0, 0, 0],
      payment_type: MortgagePaymentType.PRINCIPAL_INTEREST.toString(),
    },
    transformValues: (values) => ({
      ...values,
      annual_interest_rate: values.annual_interest_rate / 100,
      client_extra_payments_per_period: parseFloat(
        values.client_extra_payments_per_period.toString()
      ),
    }),
    validate: {
      loan_amount: (value) => value <= 0 || value > 999999999 ? 'Invalid loan amount' : null,
      term_of_loan_in_years: (value) => value <= 0 || value > 999999999 ? 'Invalid term of loan' : null,
      annual_interest_rate: (value) => value < 1 || value > 100 ? 'Invalid annual interest rate.' : null,
    }
  });

  const calculate = function (values: MortgageSummary) {
    setIsLoading(true);
    setMortgateData(undefined);
    scrollIntoView();
    setTimeout(() => {
      const M = new Mortgage(values);
      // console.log(values);
      M.calculate();
      // console.log(M.getTotalPayments());
      console.log(M.mortgage_data);
      setMortgateData(M);
      M.calculateFromTerm();
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = function () {
    return form.onSubmit((values) => calculate(values as MortgageSummary));
  }

  return (
    <Container my="md">
      <Grid style={{ gap: 30, justifyContent: 'center' }}>
        <Grid.Col xs={5}>
          <Title order={3} className="section-title">Loan Details</Title>

          <form onSubmit={handleSubmit()} style={{ marginBottom: '40px' }}>
            <Grid style={{ rowGap: '15px' }}>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Loan Amount">
                  <Input {...form.getInputProps('loan_amount')} type="number"
                  />
                  {form.errors?.loan_amount && (
                    <Input.Error>{form.errors?.loan_amount}</Input.Error>
                  )}
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Loan Term">
                  <Input {...form.getInputProps('term_of_loan_in_years')} type="number" />
                  {form.errors?.term_of_loan_in_years && (
                    <Input.Error>{form.errors?.term_of_loan_in_years}</Input.Error>
                  )}
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Interest Rate">
                  <Input
                    {...form.getInputProps('annual_interest_rate')}
                    rightSection={<>%</>}
                    type="number"
                  />
                  {form.errors?.annual_interest_rate && (
                    <Input.Error>{form.errors?.annual_interest_rate}</Input.Error>
                  )}
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={6}>
                <Select
                  label="Payment Type"
                  placeholder="Pick one"
                  data={[
                    { value: '1', label: 'Principal & Interest' },
                    { value: '2', label: 'Interest Only' },
                  ]}
                  {...form.getInputProps('payment_type')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Select
                  label="Repayment Frequency"
                  placeholder="Pick one"
                  data={[
                    { value: '12', label: 'Monthly' },
                    { value: '24', label: 'Fortnightly' },
                    { value: '48', label: 'Weekly' },
                  ]}
                  {...form.getInputProps('payment_frequency')}
                />
                <Button disabled={isLoading} type="submit" mt="md" style={{ display: 'none' }}>
                  Calculate Mortgage
                </Button>
              </Grid.Col>
            </Grid>
          </form>

          <Title order={3} className="section-title">Loan Details</Title>

          <form onSubmit={form.onSubmit((values) => calculate(values as MortgageSummary))}>
            <Grid style={{ rowGap: '15px' }}>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Add Extra to your Monthly Loan Repayment">
                  <Input
                    min={0}
                    {...form.getInputProps('client_extra_payments_per_period')}
                    icon={<>$</>}
                    type="number"
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={12}>
                <Button type="submit" mt="md" disabled={isLoading} >
                  Calculate Mortgage
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col xs={6} ref={targetRef}>
          <Stack>
            <Title order={3} className="section-title">Estimated Results</Title>
            <SegmentedControl
              color="orange"
              value={loanSummaryView}
              onChange={(val) => {
                setLoanSummaryView(val as LoanView);
              }}
              data={[
                { label: 'Current Loan', value: LoanView.WITHOUT_EXTRA_PAYMENTS },
                { label: 'With Extra Payment', value: LoanView.WITH_EXTRA_PAYMENTS },
              ]}
            />
            {
              mortgageData && (
                <Spoiler maxHeight={400} showLabel="Show more" hideLabel="Hide">
                  {loanSummaryView === LoanView.WITHOUT_EXTRA_PAYMENTS && (
                    <Stack>
                      <Title order={6}>Monthly Payments</Title>
                      <Title order={1}>{dollarFormat.format(mortgageData?.getPayments() || 0)}</Title>
                      <Space />
                      <Title order={6}>Number of Payments</Title>
                      <Title order={1}>{mortgageData?.getNumberOfPayments() || 0}</Title>
                      <Space />
                      <Title order={6}>Extra Payments</Title>
                      <Title order={1}>{dollarFormat.format(0)}</Title>
                      <Space />
                      <Title order={6}>Total Payments</Title>
                      <Title order={1}>
                        {dollarFormat.format(
                          (mortgageData?.getNumberOfPayments() || 0) *
                          (mortgageData?.getPayments() || 0)
                        )}
                      </Title>
                      <Space />
                      <Title order={6}>Total Interest</Title>
                      <Title order={1}>
                        {dollarFormat.format(mortgageData?.getTotalInterest() || 0)}
                      </Title>

                      <Space />
                      <Title order={6}>Years to Pay Off Loan</Title>
                      <Title>{mortgageData?.getYearsToPayOffLoan()}</Title>
                    </Stack>
                  )}

                  {loanSummaryView === LoanView.WITH_EXTRA_PAYMENTS && (
                    <Stack>
                      <Title order={6}>Monthly Payments</Title>
                      <Title order={1}>
                        {dollarFormat.format(mortgageData?.getPayments(true) || 0)}
                      </Title>
                      <Space />
                      <Title order={6}>Number of Payments</Title>
                      <Title order={1}>{mortgageData?.getNumberOfPayments(true) || 0}</Title>
                      <Space />
                      <Title order={6}>Extra Payments</Title>
                      <Title order={1}>
                        {dollarFormat.format(
                          mortgageData?.summary.client_extra_payments_per_period || 0
                        )}
                      </Title>
                      <Space />
                      <Title order={6}>Total Payments</Title>
                      <Title order={1}>
                        {dollarFormat.format(
                          (mortgageData?.getNumberOfPayments(true) || 0) *
                          (mortgageData?.getPayments() || 0)
                        )}
                      </Title>
                      <Space />
                      <Title order={6}>Total Interest</Title>
                      <Title order={1}>
                        {dollarFormat.format(_.sumBy(mortgageData?.mortgage_data, 'interest') || 0)}
                      </Title>

                      <Space />
                      <Title order={6}>Years to Pay Off Loan</Title>
                      <Title>{mortgageData?.getYearsToPayOffLoan()}</Title>
                    </Stack>
                  )}
                </Spoiler>
              )
            }
            {
              !mortgageData && (
                <>
                  <Skeleton width="34%" height={20} animate={isLoading} />
                  <Skeleton width="100%" height={50} animate={isLoading} />
                  <Space />
                  <Skeleton width="34%" height={20} animate={isLoading} />
                  <Skeleton width="100%" height={50} animate={isLoading} />
                  <Space />
                  <Skeleton width="34%" height={20} animate={isLoading} />
                  <Skeleton width="100%" height={50} animate={isLoading} />
                </>
              )
            }


          </Stack>
        </Grid.Col>
        {
          mortgageData && (
            <Grid.Col xs={12}>
              <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Saved Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {mortgageData?.calculateFromTerm().map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{dollarFormat.format(row.payment)}</td>
                      <td>{dollarFormat.format(row.principal)}</td>
                      <td>{dollarFormat.format(row.interest)}</td>
                      <td>{dollarFormat.format(row.balance)}</td>
                      <td>{dollarFormat.format(row.savedInterest)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Year</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Saved Interest</th>
                  </tr>
                </tfoot>
              </Table>
            </Grid.Col>
          )
        }
      </Grid>
    </Container>
  );
}
