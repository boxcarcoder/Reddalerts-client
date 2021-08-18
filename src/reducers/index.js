import { combineReducers } from 'redux';
import auth from './auth';
import subreddit from './subreddit';
import alert from './alert';

export default combineReducers({
  auth,
  subreddit,
  alert,
});
