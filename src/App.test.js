import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import App from './App';

test('App successfully loads', () => {
  render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
  );

  expect(screen.queryAllByText(/BARISTA-MATIC/)[0]).toBeInTheDocument();
});
