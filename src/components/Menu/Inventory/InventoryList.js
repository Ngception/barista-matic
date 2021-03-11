import React from 'react';

const InventoryList = (props) => {
  const { inventory } = props;

  return (
    <div>
      {inventory.map((ingredient) => (
        <div key={ingredient.name} className='d-flex'>
          <p>{ingredient.name}</p>
          <p className='ml-auto'>x {ingredient.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
