import { combineReducers } from 'redux';
import auth from './auth';
import subreddit from './subreddit';
import profile from './profile';

export default combineReducers({
  auth,
  subreddit,
  profile,
});
