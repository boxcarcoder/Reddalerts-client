/* eslint-disable import/no-anonymous-default-export */
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  SUBMIT_PHONE_NUMBER,
  SUBMIT_PHONE_NUMBER_FAIL,
  DELETE_PHONE_NUMBER,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  loggedInUser: null,
  loading: false,
  isAuthenticated: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loggedInUser: payload.user,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loggedInUser: null,
      };
    case SUBMIT_PHONE_NUMBER:
      return {
        ...state,
        loggedInUser: payload,
      };
    case SUBMIT_PHONE_NUMBER_FAIL:
      return {
        ...state,
        error: payload,
      };
    case DELETE_PHONE_NUMBER:
      return {
        ...state,
        loggedInUser: payload,
      };
    default:
      return state;
  }
}
