import React, { useState } from 'react';

import UpdateForm from './UpdateForm';
import Payment from '../../../Payment';

const UpdateView = (props) => {
  const [paymentView, setPaymentView] = useState(false);
  const { inventory } = props;

  return (
    <div>
      {!paymentView ? (
        <UpdateForm triggerPayment={setPaymentView} inventory={inventory} />
      ) : (
        <>
          <button
            onClick={() => setPaymentView(false)}
            type='button'
            className='btn btn-dark'
          >
            Go Back
          </button>
          <Payment />
        </>
      )}
    </div>
  );
};

export default UpdateView;
