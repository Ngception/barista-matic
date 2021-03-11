import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../app/store';
import App from '../App';

test('App successfully loads', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );

  expect(screen.queryAllByText(/BARISTA-MATIC/)[0]).toBeInTheDocument();
});
