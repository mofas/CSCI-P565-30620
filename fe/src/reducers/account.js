import { createDuck } from 'redux-duck';
import { fromJS, Map } from 'immutable';

import API from '../middleware/API';
/**
 * Duck
 */
const duck = createDuck('account');

/**
 * Action types
 */

const LOAD_ACCOUNT = duck.defineType('LOAD_ACCOUNT');
const ACCOUNT_LOADED = duck.defineType('ACCOUNT_LOADED');

/**
 * Action creators
 */
export const getUserInfo = () => dispatch => {
  dispatch(duck.createAction(LOAD_ACCOUNT)());

  API.API('/account/get_user_info').then(res => {
    if (res.status === 401) {
      window.location.href = '#/';
    } else if (res.err === 1) {
      window.location.href = '#/go_verify_email/' + res.email;
    } else if (res.err === 2) {
      window.location.href = '#' + res.duoUrl;
    } else if (res.err === 3) {
      window.location.href = '#/ban';
    } else {
      dispatch(duck.createAction(ACCOUNT_LOADED)(res));
    }
  });
};

export const logout = () => {
  API.API('/logout').then(res => {
    window.location.href = '#/';
  });
};

/**
 * Reducer
 */

const initialState = fromJS({
  userInfo: Map({}),
  loading: false,
});

const reducer = duck.createReducer(
  {
    [LOAD_ACCOUNT]: (state, action) => {
      return state.set('loading', true);
    },

    [ACCOUNT_LOADED]: (state, action) => {
      return state
        .set('loading', false)
        .set('userInfo', fromJS(action.payload));
    },
  },
  initialState
);

export default reducer;
