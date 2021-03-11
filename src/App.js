import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import Confirmation from './components/Payment/Confirmation';
import Edit from './components/Menu/Edit';
import Homepage from './components/Home';
import Menu from './components/Menu';
import Navbar from './components/Nav';
import SingleMenuItem from './components/Menu/SingleMenuItem';

import CartContext from './components/Context/CartContext';
import MenuContext from './components/Context/MenuContext';

function App() {
  const cartCtxValues = {
    cartItems: [],
    total: 0,
    submitHandler: '',
    confirmationId: '',
  };
  const menuCtxValues = { currentDrink: {} };

  return (
    <div className='App'>
      <Navbar />
      <div>
        <Switch>
          <CartContext.Provider value={cartCtxValues}>
            <MenuContext.Provider value={menuCtxValues}>
              <Route exact path='/menu' component={Menu} />
              <Route exact path='/menu/:drink' component={SingleMenuItem} />
              <Route exact path='/menu/inventory/edit' component={Edit} />
            </MenuContext.Provider>
            <Route exact path='/' component={Homepage} />
            <Route
              exact
              path='/payment/confirmation'
              component={Confirmation}
            />
          </CartContext.Provider>
        </Switch>
      </div>
    </div>
  );
}

export default App;
