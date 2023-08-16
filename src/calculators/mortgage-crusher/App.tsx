import { Button, Container, Grid, Input, Select, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Mortgage } from '../../api';
import {
  MortgageData,
  MortgagePaymentFrequency,
  MortgagePaymentType,
  MortgageSummary,
} from '../../api/mortgage/types';
import { dollarFormat } from '../../api/utils/numbers';

export default function App() {
  const [mortgageData, setMortgateData] = useState<Mortgage>();
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
                    {...form.getInputProps('client_extra_payments_per_period')}
                    icon={<>$</>}
                    type="number"
                  />
                </Input.Wrapper>
              </Grid.Col>
              {/* <Grid.Col xs={6}>
                <Input.Wrapper label="Add a Lump Sum Amount of">
                  <Input {...form.getInputProps('loan_amount')} icon={<>$</>} />
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
              </Grid.Col> */}
              <Grid.Col xs={12}>
                <Button type="submit" mt="md">
                  Submit
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col xs={6}>1</Grid.Col>
        <Grid.Col xs={12}>
          <Table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
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
              </tr>
            </tfoot>
          </Table>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
