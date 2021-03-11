import React from 'react';
import { Link } from 'react-router-dom';

import '../styles.css';

const Homepage = () => {
  return (
    <div className='home-main w-100 vh-100'>
      <img
        className='w-100 h-100'
        src='https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        alt='bg'
      />
      <div className='home-overlay w-100 h-100'></div>
      <div className='container'>
        <div className='home-jumbotron jumbotron text-center bg-transparent text-light mx-auto'>
          <h1 className='display-4'>BARISTA-MATIC</h1>
          <p className='lead font-italic'>Not your average joe</p>
          <hr className='my-4 bg-white' />
          <Link to='/menu' className='btn btn-lg btn-dark my-4'>
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
