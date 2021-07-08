/* eslint-disable import/no-anonymous-default-export */
import { SUBMIT_PHONE_NUMBER, DELETE_PHONE_NUMBER } from '../actions/types';

const initialState = {
  profilePhoneNumber: null,
  loading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_PHONE_NUMBER:
      return {
        ...state,
        profilePhoneNumber: payload.phone_num,
      };
    case DELETE_PHONE_NUMBER:
      return {
        ...state,
        profilePhoneNumber: payload.phone_num,
      };
    default:
      return state;
  }
}
