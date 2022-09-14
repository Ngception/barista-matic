import React, { useEffect, useState } from 'react';
import axios from 'axios';

import InventoryList from './Inventory/InventoryList';
import Loader from '../Loader';
import MenuList from './MenuList';

import '../styles.css';

const Menu = () => {
  const [ingredients, setIngredients] = useState([]);
  const [availableDrinks, setAvailableDrinks] = useState([]);
  const [noStockDrinks, setNoStockDrinks] = useState([]);
  const [customDrinks, setCustomDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = () => {
      axios
        .all([
          axios.get(
            `${process.env.BASE_URL}/fetchInventory`
          ),
          axios.get(
            `${process.env.BASE_URL}/fetchDrinks`
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const ingredients = responses[0].data.data || [];
            const { availableDrinks } = responses[1].data || [];
            const { outOfStockDrinks } = responses[1].data || [];
            const customDrinks = [];
            const regularDrinks = [];

            availableDrinks.forEach((drink) => {
              if (drink.custom_drink) customDrinks.push(drink);
              else regularDrinks.push(drink);
            });

            setIngredients([...ingredients]);
            setNoStockDrinks([...outOfStockDrinks]);
            setAvailableDrinks([...regularDrinks]);
            setCustomDrinks([...customDrinks]);
            setLoading(false);
          })
        );
    };
    fetchAll();
  }, []);

  return (
    <div className='menu-main d-flex'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='container menu-inventory-list col-lg-3 col-md-4 py-4 bg-light'>
            <h2>Inventory</h2>
            <hr className='bg-white my-4' />
            <InventoryList inventory={ingredients} />
          </div>
          <div className='container col-lg-9 col-md-8 py-4 pl-5'>
            <div>
              <h2>Drinks</h2>
              <hr className='my-4 bg-white' />
              <MenuList drinks={availableDrinks} />
            </div>
            {customDrinks.length > 0 ? (
              <div>
                <h2>Custom Drinks</h2>
                <hr className='my-4 bg-white' />
                <MenuList drinks={customDrinks} />
              </div>
            ) : null}
            {noStockDrinks.length > 0 ? (
              <div>
                <h2>Not Available</h2>
                <hr className='my-4 bg-white' />
                <MenuList drinks={noStockDrinks} noStock={true} />
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
