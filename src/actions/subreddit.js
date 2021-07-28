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

      // Create a JSON object to send as a payload to the reducer.
      let newResData = {};

      // Fetch the keywords from all Monitor objects from the backend
      // that correspond to the logged in user and designated subreddit.
      let monitored_keywords = [];
      for (let i = 0; i < res.data.monitors.length; i++) {
        monitored_keywords.push(res.data.monitors[i].keyword.keyword);
      }

      // Create a JSON object that contains subreddit name and corresponding keywords.
      let subredditJSON = {};
      subredditJSON['subreddit_name'] =
        res.data.monitors[0].subreddit.subreddit_name;
      subredditJSON['keywords'] = monitored_keywords;
      newResData['subreddit'] = subredditJSON;

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

    console.log('res.data: ', res.data);

    // Create a JSON object to send as a payload to the reducer.
    let newResData = {};

    // Fetch the subreddits and keywords from all Monitor objects that correspond to the logged in user.
    let monitored_subreddits = [];
    let prev_subreddit_name;
    let curr_subreddit_name;
    let curr_keyword;
    let monitored_subreddit_idx = -1;
    let curr_monitored_subreddit;

    for (let i = 0; i < res.data.monitors.length; i++) {
      curr_subreddit_name = res.data.monitors[i].subreddit.subreddit_name;
      curr_keyword = res.data.monitors[i].keyword.keyword;
      let subredditJSON = {};

      if (prev_subreddit_name !== curr_subreddit_name) {
        // Create a new entry with the current subreddit and current keyword.
        subredditJSON['subreddit_name'] = curr_subreddit_name;
        subredditJSON['keywords'] = curr_keyword;
        monitored_subreddits.push(subredditJSON);

        monitored_subreddit_idx++;
      } else if (prev_subreddit_name === curr_subreddit_name) {
        // Update the current monitored subreddit with the current keyword.
        curr_monitored_subreddit =
          monitored_subreddits[monitored_subreddit_idx];

        curr_monitored_subreddit['keywords'] = [
          ...curr_monitored_subreddit['keywords'],
          curr_keyword,
        ];
      }
      prev_subreddit_name = curr_subreddit_name;
    }

    newResData['subreddits'] = monitored_subreddits;

    // Add keywords to each of these subreddits.

    dispatch({
      type: FETCH_SUBREDDITS,
      payload: newResData,
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
