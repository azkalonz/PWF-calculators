import { Container, Grid } from '@mantine/core';
import { Mortgage } from '../../api';
import { MortgagePaymentFrequency } from '../../api/mortgage/types';

export default function App() {
  const M = new Mortgage({
    loan_amount: 407000,
    payment_frequency: MortgagePaymentFrequency.MONTHLY,
    term_of_loan_in_years: 30,
    annual_interest_rate: 0.04,
    client_extra_payments_per_period: 0,
    income_generating_years: [0, 0, 0, 0, 0],
  });

  return (
    <Container my="md">
      <Grid>
        <Grid.Col xs={3}>1</Grid.Col>
        <Grid.Col xs={3}>1</Grid.Col>
        <Grid.Col xs={6}>1</Grid.Col>
      </Grid>
    </Container>
  );
}
