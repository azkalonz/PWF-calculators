import { Button, Container, Grid, Input, Select } from '@mantine/core';
import { Mortgage } from '../../api';
import {
  MortgagePaymentFrequency,
  MortgagePaymentType,
  MortgageSummary,
} from '../../api/mortgage/types';
import { useForm } from '@mantine/form';

export default function App() {
  const form = useForm({
    initialValues: {
      loan_amount: 0,
      payment_frequency: MortgagePaymentFrequency.MONTHLY.toString(),
      term_of_loan_in_years: 0,
      annual_interest_rate: 4,
      client_extra_payments_per_period: 0,
      income_generating_years: [0, 0, 0, 0, 0],
      payment_type: MortgagePaymentType.PRINCIPAL_INTEREST.toString(),
    },
    transformValues: (values) => ({
      ...values,
      annual_interest_rate: values.annual_interest_rate / 100,
    }),
  });

  const calculate = function (values: MortgageSummary) {
    const M = new Mortgage(values);
    console.log(values);
    console.log(M.calculate());
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
        </Grid.Col>
        <Grid.Col xs={6}>1</Grid.Col>
      </Grid>
    </Container>
  );
}
