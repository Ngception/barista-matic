import React from 'react';

import '../styles.css';

const MenulistItem = (props) => {
  const { noStock } = props;
  const { image, name } = props.drinkInfo;
  return (
    <div className='menu-list-item-main'>
      <img
        className={noStock ? 'noStock-menu-item' : null}
        src={image}
        alt='drink'
      />
      <p className='text-center'>{name}</p>
    </div>
  );
};

export default MenulistItem;
