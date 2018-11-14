import {
  clientId,
  apiKey,
  discoveryDocs,
  scope,
  range,
  spreadsheetId
} from "../credentials";
import loadScript from 'load-script';

export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const SELECT_STORE = "SELECT_STORE";
export const RESET_STORE = "RESET_STORE";
//export const CREATE_SHIPMENT = "CREATE_SHIPMENT"

export const selectStore = storeId => ({
  type: SELECT_STORE,
  storeId
});

export const resetStore = storeId => ({
  type: RESET_STORE,
  storeId
});

export const requestPosts = storeId => ({
  type: REQUEST_POSTS,
  storeId
});

export const receivePosts = (storeId, values) => ({
  type: RECEIVE_POSTS,
  storeId,
  posts: values.map(post => ({transaction: post[0], storeId: post[1], qty: post[2]})),
  receivedAt: Date.now()
});

const fetchPosts = storeId => dispatch => {
  dispatch(requestPosts(storeId));
  return loadScript("https://apis.google.com/js/api.js", () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({apiKey, clientId, discoveryDocs, scope})
        .then(() => {
          if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            window.gapi.auth2.getAuthInstance().signIn();
          }

          window.gapi.client.sheets.spreadsheets.values
            .get({spreadsheetId, range})
            .then(data => dispatch(receivePosts(storeId, data.result.values)));
        });
    });
  });
};

const shouldFetchPosts = (state, storeId) => {
  const posts = state.postsByStoreId[storeId];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didReset;
};

export const fetchPostsIfNeeded = storeId => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), storeId)) {
    return dispatch(fetchPosts(storeId));
  }
};
/*export const createShipment = (storeId, values) => ({
  type: CREATE_SHIPMENT,
  storeId,
  posts: values.map(post => ({transaction: post[0], storeId: post[1], qty: post[2]})),
  receivedAt: Date.now()
}); */
