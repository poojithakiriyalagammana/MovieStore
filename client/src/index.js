import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import setAuthHeaders from './utils/setAuthHeaders';
import store from './store';
import { loadUser } from './store/actions/auth';

// Set token in headers if exists
const token = localStorage.getItem('jwtToken');
if (token) {
  setAuthHeaders({});
  store.dispatch(loadUser());
}

ReactDOM.render(<App />, document.getElementById('root'));