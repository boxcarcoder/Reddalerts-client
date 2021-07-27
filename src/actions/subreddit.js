import {
  SUBMIT_SUBREDDIT_INFO,
  SUBMIT_SUBREDDIT_INFO_FAIL,
  FETCH_SUBREDDITS,
  FETCH_SUBREDDITS_FAIL,
  DELETE_SUBREDDIT,
  DELETE_SUBREDDIT_FAIL,
  UPDATE_SUBREDDIT_KEYWORDS,
} from './types';
import axios from 'axios';

export const submitSubredditInfo =
  ({ id, subredditName, subredditKeywords }) =>
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
        subredditName,
        subredditKeywords,
      });

      const res = await axios.post('/api/submitSubredditInfo', body, config);

      // Fetch the keywords from all Monitor objects from the backend
      // that correspond to the logged in user and designated subreddit.
      let monitored_keywords = [];
      for (let i = 0; i < res.data.monitors.length; i++) {
        monitored_keywords.push(res.data.monitors[i].keyword.keyword);
      }

      // Create a JSON object to send as a payload to the reducer.
      let newResData = {};

      // Create a JSON object that contains subreddit name and corresponding keywords.
      let subredditInfo = {};
      subredditInfo['subreddit_name'] =
        res.data.monitors[0].subreddit.subreddit_name;
      subredditInfo['keywords'] = monitored_keywords;
      newResData['subreddit'] = subredditInfo;

      // Either update existing data or submit new data.
      if (res.data.update === 'true') {
        dispatch({
          type: UPDATE_SUBREDDIT_KEYWORDS,
          payload: newResData,
        });
      } else {
        dispatch({
          type: SUBMIT_SUBREDDIT_INFO,
          payload: newResData,
        });
      }
    } catch (err) {
      dispatch({
        type: SUBMIT_SUBREDDIT_INFO_FAIL,
        payload: { msg: err },
      });
    }
  };

export const fetchUserSubreddits = (id) => async (dispatch) => {
  try {
    const res = await axios.get('/api/fetchSubredditsInfo', {
      params: {
        id,
      },
    });

    dispatch({
      type: FETCH_SUBREDDITS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: FETCH_SUBREDDITS_FAIL,
      payload: { msg: err },
    });
  }
};

export const deleteMonitoredSubreddit =
  (id, subredditName) => async (dispatch) => {
    try {
      const res = await axios.delete('/api/deleteMonitoredSubreddit', {
        params: {
          id,
          subredditName,
        },
      });

      dispatch({
        type: DELETE_SUBREDDIT,
        payload: res.data,
      });
    } catch (err) {}
  };
