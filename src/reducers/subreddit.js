/* eslint-disable import/no-anonymous-default-export */
import {
  SUBMIT_SUBREDDIT_INFO,
  SUBMIT_SUBREDDIT_INFO_FAIL,
  FETCH_SUBREDDITS,
  FETCH_SUBREDDITS_FAIL,
  DELETE_SUBREDDIT,
  DELETE_SUBREDDIT_FAIL,
  UPDATE_SUBREDDIT_KEYWORDS,
  CLEAR_CURRENT_SUBREDDIT,
} from '../actions/types';

const initialState = {
  subreddits: [], // change this into a object?
  loading: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_SUBREDDIT_INFO:
      return {
        ...state,
        subreddits: [...state.subreddits, payload.subreddit],
      };
    case SUBMIT_SUBREDDIT_INFO_FAIL:
      return {
        ...state,
        error: payload,
      };
    case UPDATE_SUBREDDIT_KEYWORDS:
      return {
        ...state,
        subreddits: state.subreddits.map((subreddit) =>
          subreddit.subreddit_name === payload.subreddit.subreddit_name
            ? {
                ...subreddit,
                keywords: payload.subreddit.keywords,
              }
            : subreddit
        ),
      };
    case FETCH_SUBREDDITS:
      return {
        ...state,
        subreddits: payload.subreddits,
      };
    case FETCH_SUBREDDITS_FAIL:
      return {
        ...state,
        error: payload,
      };
    case DELETE_SUBREDDIT:
      return {
        ...state,
        subreddits: payload.subreddits,
      };
    case DELETE_SUBREDDIT_FAIL:
      return {
        ...state,
        error: payload,
      };
    case CLEAR_CURRENT_SUBREDDIT:
      return {
        ...state,
        subreddits: clearCurrentSubreddit(state.subreddits, payload.subreddit), // I should only clear the element that corresponds to the designated subreddit.
      };
    default:
      return state;
  }
}

function clearCurrentSubreddit(subreddits, currSubreddit) {
  let currSubredditName = currSubreddit.subreddit_name;
  for (let i = 0; i < subreddits.length; i++) {
    if (subreddits[i].subreddit_name === currSubredditName) {
      subreddits.splice(i, 1);
    }
  }
  return subreddits;
}
