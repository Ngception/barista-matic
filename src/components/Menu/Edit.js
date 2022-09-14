import React, { useEffect, useState } from 'react';
import axios from 'axios';

import InventoryUpdate from './Inventory/Update';
import Loader from '../Loader';
import MenuForm from './MenuForm';

const viewOptions = ['Inventory', 'Drinks'];

const Edit = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('Inventory');

  useEffect(() => {
    const fetchIngredients = () => {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/fetchInventory`
        )
        .then((res) => {
          const ingredients = res.data.data;
          setIngredients([...ingredients]);
          setLoading(false);
        });
    };
    fetchIngredients();
  }, []);

  const handleClick = (view) => {
    setView(view);
  };

  return (
    <div className='edit-container'>
      <div className='container edit-form col-lg-4 col-md-6 col-sm-8 col-xs-10 pt-4 bg-light'>
        {!loading ? (
          <>
            <div
              className='btn-group py-4 w-100'
              role='group'
              aria-label='Basic example'
            >
              {viewOptions.map((view) => (
                <button
                  key={view}
                  type='button'
                  value={view}
                  className='btn btn-secondary'
                  onClick={() => handleClick(view)}
                >
                  {view}
                </button>
              ))}
            </div>
            <h4 className='pb-4'>Minimum: $0.50</h4>
            {view === 'Inventory' ? (
              <>
                <InventoryUpdate inventory={ingredients} />
              </>
            ) : (
              <>
                <MenuForm inventory={ingredients} />
              </>
            )}
          </>
        ) : (
          <div className='loader-container edit-loader'>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
