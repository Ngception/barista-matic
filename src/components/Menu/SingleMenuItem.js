import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import CartContext from '../Context/CartContext';
import MenuContext from '../Context/MenuContext';

import Payment from '../Payment';
import Loader from '../Loader';

import { fetchFromLocalStorage, removeFromLocalStorage } from '../shared';

const SingleMenuItem = (props) => {
  const cartCtx = useContext(CartContext);
  const menuCtx = useContext(MenuContext);
  const [view, setView] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const calculateTotal = (items) => {
      let total = 0;

      for (const { units, cost } of items) total += units * cost;

      cartCtx.total = total;
      setPrice(total.toFixed(2));
    };

    const fetchLocalData = () => {
      const currentDrink = fetchFromLocalStorage('currentDrink');
      if (currentDrink) {
        calculateTotal(currentDrink.ingredients);
        setView(currentDrink);
      }
    };

    if (!menuCtx.currentDrink.name) fetchLocalData();
    else {
      setView(menuCtx.currentDrink);
      calculateTotal(menuCtx.currentDrink.ingredients);
    }

    return () => removeFromLocalStorage();
  }, [cartCtx, menuCtx]);

  const goBack = () => {
    props.history.goBack();
  };

  const handleClick = () => {
    cartCtx.cartItems = [view];
    cartCtx.total = price;
    cartCtx.submitHandler = async () => {
      return await axios.post(
        'https://us-central1-barista-matic.cloudfunctions.net/decrementInventory',
        {
          cartItems: view,
        }
      );
    };
  };

  return (
    <div className='container pt-4 d-flex'>
      {!view ? (
        <div className='loader-container w-100 h-100'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='single-menu-item col-md-6'>
            <button
              onClick={goBack}
              type='button'
              className='btn btn-dark my-4 d-flex'
            >
              <span className='material-icons mr-2'>arrow_back</span> Back
            </button>
            <img className='w-100' src={view.image} alt='drink' />
            <h1 className='my-4'>{view.name}</h1>
            <p>{view.description}</p>
          </div>
          <div className='single-menu-item ml-auto col-md-5 bg-light d-flex flex-column justify-content-between py-3'>
            <div>
              <h2>Ingredients</h2>
              <hr className='bg-light' />
              <ul className='list-group list-group-flush'>
                {view.ingredients
                  ? view.ingredients.map(({ name, units }, idx) => (
                      <li key={idx} className='list-group-item d-flex'>
                        <p>{name}</p>
                        <p className='ml-auto'>
                          {units > 1 ? `${units} units` : `${units} unit`}
                        </p>
                      </li>
                    ))
                  : null}
                <li className='list-group-item mt-4 d-flex'>
                  <h3>Price</h3>
                  <h3 className='ml-auto'>${price}</h3>
                </li>
              </ul>
            </div>
            {view.noStock ? (
              <h3 className='text-secondary text-center'>Unavailable</h3>
            ) : (
              <div className='w-100' onClick={handleClick}>
                <Payment />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default withRouter(SingleMenuItem);
