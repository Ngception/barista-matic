import React from 'react';
import { Link } from 'react-router-dom';

import '../styles.css';

const links = [{
  to: '/menu',
  text: 'Menu'
}, {
  to: '/menu/inventory/edit',
  text: 'Edit'
}]

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-dark px-4 py-3 sticky-top'>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarTogglerDemo01'
        aria-controls='navbarTogglerDemo01'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarTogglerDemo01'>
        <Link to='/' className='navbar-brand text-white'>
          BARISTA-MATIC
        </Link>
        <ul className='navbar-nav ml-auto my-2 my-lg-0'>
          {links.map(({ to, text}) => (
            <li key={to} className='nav-item'>
            <Link to={to} className='nav-link text-white'>
              {text}
            </Link>
          </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
