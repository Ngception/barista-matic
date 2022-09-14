import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from './Form';

const Payment = () => {
  return (
    <Elements stripe={loadStripe(process.env.TEST_STRIPE_KEY)}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
