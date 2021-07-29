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
      let monitors = res.data.monitors;

      // Fetch the keywords from all Monitor objects from the backend
      // that correspond to the logged in user and designated subreddit.
      let monitored_keywords = [];
      for (let i = 0; i < monitors.length; i++) {
        monitored_keywords.push(monitors[i].keyword.keyword);
      }

      // Create a JSON object that contains the submitted subreddit name and corresponding keywords.
      let subredditJSON = {};
      subredditJSON['subreddit_name'] = monitors[0].subreddit.subreddit_name;
      subredditJSON['keywords'] = monitored_keywords;

      // Create a JSON object to send as a payload to the reducer.
      let newResData = {};
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

    let monitors = res.data.monitors;

    // Aggregate all keywords and their subreddit into subreddit JSON objects.
    let monitored_subreddits = aggregate_subreddits_keywords(monitors);

    // Create a JSON object to send as a payload to the reducer.
    let newResData = {};
    newResData['subreddits'] = monitored_subreddits;

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

      let monitors = res.data.monitors;

      // Aggregate all keywords and their subreddit into subreddit JSON objects.
      let monitored_subreddits = aggregate_subreddits_keywords(monitors);

      // Create a JSON object to send as a payload to the reducer.
      let newResData = {};
      newResData['subreddits'] = monitored_subreddits;

      dispatch({
        type: DELETE_SUBREDDIT,
        payload: newResData,
      });
    } catch (err) {
      dispatch({
        type: DELETE_SUBREDDIT_FAIL,
        payload: { msg: err },
      });
    }
  };

// Helper function
function aggregate_subreddits_keywords(monitors) {
  let monitored_subreddits = []; // An array of JSON objects, each representing a Subreddit and its corresponding Keywords.
  let prev_subreddit_name;
  let curr_subreddit_name;
  let curr_keyword;
  let monitored_subreddit_idx = -1;
  let curr_monitored_subreddit;

  for (let i = 0; i < monitors.length; i++) {
    curr_subreddit_name = monitors[i].subreddit.subreddit_name;
    curr_keyword = monitors[i].keyword.keyword;
    let subredditJSON = {};

    if (prev_subreddit_name !== curr_subreddit_name) {
      // Create a new entry with the current subreddit and current keyword.
      subredditJSON['subreddit_name'] = curr_subreddit_name;
      subredditJSON['keywords'] = curr_keyword;
      monitored_subreddits.push(subredditJSON);

      monitored_subreddit_idx++;
    } else if (prev_subreddit_name === curr_subreddit_name) {
      // Update the current monitored subreddit with the current keyword.
      curr_monitored_subreddit = monitored_subreddits[monitored_subreddit_idx];

      curr_monitored_subreddit['keywords'] = [
        ...curr_monitored_subreddit['keywords'],
        curr_keyword,
      ];
    }
    prev_subreddit_name = curr_subreddit_name;
  }

  return monitored_subreddits;
}
