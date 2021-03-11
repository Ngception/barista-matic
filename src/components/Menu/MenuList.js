import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import MenuListItem from './MenuListItem';

import MenuContext from '../Context/MenuContext';

const MenuList = (props) => {
  const menuCtx = useContext(MenuContext);
  const { drinks, noStock } = props;

  const handleClick = (drink) => {
    const drinkInfo = {
      ...drink,
      ...(noStock && { noStock }),
    };
    menuCtx.currentDrink = drinkInfo;
    const currentDrink = JSON.stringify(drinkInfo);
    localStorage.setItem('currentDrink', currentDrink);
  };

  return (
    <div className='d-flex flex-wrap'>
      {drinks.map((item) => (
        <div key={item.name} className='col-lg-4 col-md-6 col-sm-10 col-xs-10'>
          <Link
            onClick={() => handleClick(item)}
            className='nav-link text-black'
            to={`/menu/${item.link}`}
          >
            <MenuListItem drinkInfo={item} noStock={noStock} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
