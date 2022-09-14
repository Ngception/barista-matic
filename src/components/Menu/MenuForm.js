import React, { useState } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import Loader from '../Loader';

import { generateQuantities, calculateTotal } from '../shared';

const MenuForm = (props) => {
  const { inventory } = props;
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleIngredientChange = (e, ingredient) => {
    const { name, cost } = ingredient;

    setIngredients({
      ...ingredients,
      [name]: {
        units: +e.target.value,
        cost: cost,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let formattedIngredients = [];

    for (const name in ingredients) {
      const { units, cost } = ingredients[name];

      if (units > 0) {
        formattedIngredients.push({
          name,
          units,
          cost,
        });
      }
    }

    const customDrinkInfo = {
      name,
      ingredients: formattedIngredients,
    };

    axios
      .post(`${process.env.BASE_URL}/addDrink`, {
        customDrinkInfo,
      })
      .then((res) => {
        if (res.data.status === 'succeeded') {
          setLoading(false);
          setSuccess(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {success ? (
        <h3>New drink added</h3>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='col-md-6'>Name</label>
            <input
              type='text'
              className='col-md-6'
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <hr className='bg-light' />
          {inventory.map((ingredient, idx) => (
            <div key={idx} className='form-group d-flex'>
              <label className='col-md-6'>{ingredient.name}</label>
              <select
                className='form-control col-md-3'
                onChange={(e) => handleIngredientChange(e, ingredient)}
                value={
                  !ingredients[ingredient.name]
                    ? 0
                    : ingredients[ingredient.name].units
                }
              >
                {generateQuantities().map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </select>
              <p className='col-md-3 text-right'>
                $
                {!ingredients[ingredient.name]
                  ? 0
                  : (
                      ingredients[ingredient.name].units * ingredient.cost
                    ).toFixed(2)}
              </p>
            </div>
          ))}
          <hr className='bg-light pt-4' />
          {loading ? (
            <div className='loader-container'>
              <Loader />
            </div>
          ) : name && calculateTotal(ingredients) > 0.5 ? (
            <button type='submit' className='btn btn-success w-100'>
              Submit
            </button>
          ) : (
            <button disabled type='button' className='btn btn-success w-100'>
              Submit
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default withRouter(MenuForm);
