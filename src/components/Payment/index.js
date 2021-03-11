import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from './Form';

const Payment = () => {
  return (
    <Elements stripe={loadStripe('pk_test_7xZslwSM9Wlt7HJ6N8ne4AJF00RTfZiTnw')}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
