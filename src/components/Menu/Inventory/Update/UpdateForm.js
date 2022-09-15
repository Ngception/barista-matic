import React, { useContext, useState } from 'react';
import axios from 'axios';

import CartContext from '../../../Context/CartContext';

import { generateQuantities, calculateTotal } from '../../../shared';

const InventoryForm = (props) => {
  const { inventory } = props;
  const [updatedInventory, setInventory] = useState({});
  const cartCtx = useContext(CartContext);

  const handleChange = (e, ingredient) => {
    const { name, cost } = ingredient;

    setInventory({
      ...updatedInventory,
      [name]: {
        units: e.target.value,
        cost: cost,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const total = calculateTotal(updatedInventory);
    cartCtx.cartItems = [];
    cartCtx.total = total;
    cartCtx.submitHandler = async () => {
      return await axios.post(
        `${process.env['REACT_APP_BASE_URL']}/addInventory`,
        {
          ingredientsToUpdate: updatedInventory,
        }
      );
    };
    props.triggerPayment(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {inventory.map((ingredient) => (
        <div key={ingredient.name} className='form-group d-flex'>
          <label className='col-md-6'>{ingredient.name}</label>
          <select
            className='form-control col-md-3'
            value={
              !updatedInventory[ingredient.name]
                ? 0
                : updatedInventory[ingredient.name].units
            }
            onChange={(e) => handleChange(e, ingredient)}
          >
            {generateQuantities().map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
          <p className='col-md-3 text-right'>
            $
            {!updatedInventory[ingredient.name]
              ? 0
              : (
                  ingredient.cost * updatedInventory[ingredient.name].units
                ).toFixed(2)}
          </p>
        </div>
      ))}
      <hr className='bg-light' />
      <button
        disabled={calculateTotal(updatedInventory) < 0.5}
        type='submit'
        className='btn btn-success w-100'
      >
        Proceed to payment
      </button>
    </form>
  );
};

export default InventoryForm;
