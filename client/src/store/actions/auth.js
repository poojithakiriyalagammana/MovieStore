import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../types';
import { setAlert } from './alert';
import { setAuthHeaders, setUser, removeUser, isLoggedIn } from '../../utils';

const persistAuth = (dispatch, responseData, successType) => {
  const { user, token } = responseData;
  if (user) {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem('jwtToken', token);
  }
  dispatch({ type: successType, payload: responseData });
  dispatch({ type: USER_LOADED, payload: responseData });
};

export const uploadImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const url = '/users/photo/' + id;
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Login user
export const login = (username, password) => async dispatch => {
  try {
    const url = '/users/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const responseData = await response.json();
    if (response.ok) {
      persistAuth(dispatch, responseData, LOGIN_SUCCESS);
      dispatch(setAlert(`Welcome ${responseData.user.name}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const facebookLogin = e => async dispatch => {
  try {
    const { email, userID, name } = e;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userID, name })
    };
    const url = '/users/login/facebook';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      persistAuth(dispatch, responseData, LOGIN_SUCCESS);
      dispatch(setAlert(`Welcome ${responseData.user.name}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const googleLogin = ({ profileObj }) => async dispatch => {
  try {
    const { email, googleId, name } = profileObj;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, googleId, name })
    };
    const url = '/users/login/google';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      persistAuth(dispatch, responseData, LOGIN_SUCCESS);
      dispatch(setAlert(`Welcome ${responseData.user.name}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Register user
export const register = ({ name, username, email, phone, image, password }) => async dispatch => {
  try {
    const url = '/users';
    const body = { name, username, email, phone, password };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const responseData = await response.json();
    if (response.ok) {
      persistAuth(dispatch, responseData, REGISTER_SUCCESS);
      if (image) dispatch(uploadImage(responseData.user._id, image));
      dispatch(setAlert('Register Success', 'success', 5000));
    }
    if (responseData._message) {
      dispatch({ type: REGISTER_FAIL });
      dispatch(setAlert(responseData.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Load user
export const loadUser = () => async dispatch => {
  if (!isLoggedIn()) return;
  try {
    const url = '/users/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: setAuthHeaders()
    });
    const responseData = await response.json();
    if (response.ok) {
      persistAuth(dispatch, responseData, USER_LOADED);
    }
    if (!response.ok) dispatch({ type: AUTH_ERROR });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Logout
export const logout = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/users/logout';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const responseData = await response.json();
    if (response.ok) {
      removeUser();
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      dispatch({ type: LOGOUT });
      dispatch(setAlert('LOGOUT Success', 'success', 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};