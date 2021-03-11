import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import CartContext from '../Context/CartContext';

const Confirmation = () => {
  const cartCtx = useContext(CartContext);
  const { confirmationId } = cartCtx;

  useEffect(() => {
    return () => (cartCtx.confirmationId = '');
  }, [cartCtx.confirmationId]);

  return (
    <div className='confirmation-container'>
      {!confirmationId ? (
        <Redirect to='/' />
      ) : (
        <div className='container pt-4 text-center'>
          <h1>Thank you for using the Barista-matic!</h1>
          <h3>Enjoy your purchase!</h3>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
