import {
  Button,
  Container,
  Grid,
  Input,
  Paper,
  SegmentedControl,
  Select,
  Space,
  Stack,
  Table,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Mortgage } from '../../api';
import {
  LoanView,
  MortgageData,
  MortgagePaymentFrequency,
  MortgagePaymentType,
  MortgageSummary,
} from '../../api/mortgage/types';
import { dollarFormat } from '../../api/utils/numbers';
import _ from 'lodash';

export default function App() {
  const [mortgageData, setMortgateData] = useState<Mortgage>();
  const [loanSummaryView, setLoanSummaryView] = useState<LoanView>(LoanView.WITHOUT_EXTRA_PAYMENTS);
  const form = useForm({
    initialValues: {
      loan_amount: 407000,
      payment_frequency: MortgagePaymentFrequency.MONTHLY.toString(),
      term_of_loan_in_years: 30,
      annual_interest_rate: 4,
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
  });

  const calculate = function (values: MortgageSummary) {
    const M = new Mortgage(values);
    // console.log(values);
    M.calculate();
    // console.log(M.getTotalPayments());
    console.log(M.mortgage_data);
    setMortgateData(M);
    M.calculateFromTerm();
  };

  return (
    <Container my="md">
      <Grid>
        <Grid.Col xs={6}>
          <form onSubmit={form.onSubmit((values) => calculate(values as MortgageSummary))}>
            <Grid>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Loan Amount">
                  <Input {...form.getInputProps('loan_amount')} />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Loan Term">
                  <Input {...form.getInputProps('term_of_loan_in_years')} />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col xs={6}>
                <Input.Wrapper label="Interest Rate">
                  <Input
                    {...form.getInputProps('annual_interest_rate')}
                    rightSection={<>%</>}
                    type="number"
                  />
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
              </Grid.Col>
              <Grid.Col xs={12}>
                <Button type="submit" mt="md">
                  Submit
                </Button>
              </Grid.Col>
            </Grid>
          </form>

          <form onSubmit={form.onSubmit((values) => calculate(values as MortgageSummary))}>
            <Grid>
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
                <Button type="submit" mt="md">
                  Submit
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col xs={6}>
          <Stack>
            <SegmentedControl
              color="orange"
              value={loanSummaryView}
              onChange={(val) => {
                setLoanSummaryView(val as LoanView);
              }}
              data={[
                { label: 'Current Loan Payment Scenario', value: LoanView.WITHOUT_EXTRA_PAYMENTS },
                { label: 'With Extra Payments Scenario', value: LoanView.WITH_EXTRA_PAYMENTS },
              ]}
            />
            {loanSummaryView === LoanView.WITHOUT_EXTRA_PAYMENTS && (
              <Paper shadow="xs" p="md">
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
                </Stack>
              </Paper>
            )}

            {loanSummaryView === LoanView.WITH_EXTRA_PAYMENTS && (
              <Paper shadow="xs" p="md">
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
                </Stack>
              </Paper>
            )}

            <Paper shadow="xs" p="md">
              <Space />
              <Title order={6}>Years to Pay Off Loan</Title>
              <Title>{mortgageData?.getYearsToPayOffLoan()}</Title>
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={12}>
          <Table>
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
      </Grid>
    </Container>
  );
}
