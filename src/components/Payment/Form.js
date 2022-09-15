import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

import Loader from '../Loader';
import CartContext from '../Context/CartContext';

const PaymentForm = (props) => {
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cartCtx.total);
  }, [cartCtx.total]);

  const handleChange = (e) => {
    setIsComplete(e.complete);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isComplete || !stripe || !elements) return;

    try {
      setLoading(true);

      const status = await cartCtx.submitHandler();
      if (status.data.status === 'failed') {
        setLoading(false);
        setSuccess(false);
        return;
      }

      const res = await axios.post(
        `${process.env['REACT_APP_BASE_URL']}/stripePayment`,
        {
          amount: Math.round(total * 100),
        }
      );

      const { paymentIntent } = res.data;

      const result = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'John Doe',
            },
          },
        }
      );

      if (result.error) {
        console.log(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        cartCtx.cartItems = [];
        cartCtx.confirmationId = paymentIntent.id;
        setSuccess(true);
      }
      setLoading(false);
      props.history.push('/payment/confirmation');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='py-4'>
      <form onSubmit={handleSubmit}>
        <CardElement onChange={handleChange} />
        <hr className='bg-light pt-4' />
        {loading ? (
          <div className='loader-container'>
            <Loader />
          </div>
        ) : (
          <button
            className='btn btn-success w-100'
            type='submit'
            disabled={!stripe || success}
          >
            {success
              ? 'Payment confirmed'
              : `Payment $${total.toFixed(2)} not confirmed`}
          </button>
        )}
      </form>
    </div>
  );
};

export default withRouter(PaymentForm);
