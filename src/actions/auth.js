import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  SUBMIT_PHONE_NUMBER,
  SUBMIT_PHONE_NUMBER_FAIL,
  DELETE_PHONE_NUMBER,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      // configuration of the HTTP request to the backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Convert JS object into JSON to send to Flask.
      const body = JSON.stringify({ email, password });

      // Store the logged in user's token into a redux state for authentication purposes.
      const res = await axios.post('/api/login', body, config);
      // const res = await axios.post('/api/login', body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

export const register =
  ({ username, email, password }) =>
  async (dispatch) => {
    try {
      // configuration of the HTTP request to the backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Convert JS object into JSON to send to Flask.
      const body = JSON.stringify({ username, email, password });

      // Store the logged in user's token into a redux state for authentication purposes.
      const res = await axios.post('/api/register', body, config);
      // const res = await axios.post('/api/register', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const submitPhoneNumber =
  ({ id, phoneNumber }) =>
  async (dispatch) => {
    try {
      // configuration of the HTTP request to the backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({
        id,
        phoneNumber,
      });

      const res = await axios.post('/api/submitPhoneNumber', body, config);

      dispatch({
        type: SUBMIT_PHONE_NUMBER,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: SUBMIT_PHONE_NUMBER_FAIL,
        payload: { msg: err },
      });

      dispatch(
        setAlert(
          'This phone number is taken already. Please use a different phone number.'
        )
      );
    }
  };

export const deletePhoneNumber = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/deletePhoneNumber', {
      params: {
        id,
      },
    });

    dispatch({
      type: DELETE_PHONE_NUMBER,
      payload: res.data,
    });
  } catch (err) {}
};
