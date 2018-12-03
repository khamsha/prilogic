import {
  clientId,
  apiKey,
  discoveryDocs,
  scope,
  range,
  range2,
  spreadsheetId
} from "../credentials";
import loadScript from 'load-script';

export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const SELECT_STORE = "SELECT_STORE";
export const RESET_STORE = "RESET_STORE";
export const CREATE_SHIPMENT = "CREATE_SHIPMENT"
export const CREATE_NODE = "CREATE_NODE";
export const REQUEST_STATS ="REQUEST_STATS"
export const RECEIVE_STATS ="RECEIVE_STATS"


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

export const createNode = newStore => ({
  type: CREATE_NODE,
  newStore
});



export const createShipment = (storeNb, qty) => (dispatch) => {
dispatch({type: CREATE_SHIPMENT});
var values = [["","",Math.round(Math.random()*100),storeNb, qty]];
var body = {values: values};
window.gapi.client.sheets.spreadsheets.values.append({
  spreadsheetId: spreadsheetId,
  valueInputOption: "USER_ENTERED",
  range: "Store",
  resource: body
}).then((response) => {
 var result = response.result;
 console.log(`${result.updates.updatedCells} cells appended.`);
});
};

export const requestStats = () => ({
  type: REQUEST_STATS
});

export const receiveStats = (values) => ({
  type: RECEIVE_STATS,
  stats: values.map(stat => ({stPivot: stat[0], sumPivot: stat[1]})),
  receivedAt: Date.now()
});

const fetchStats = () => (dispatch) => {
  dispatch(requestStats());
  window.gapi.client.sheets.spreadsheets.values
            .get({spreadsheetId, range: range2})
            .then(data => dispatch(receiveStats(data.result.values)))};


const shouldFetchStats = (state) => {
  const stats = state.stats;
  if (!stats) {
    return true;
  }
  if (stats.isFetching) {
    return false;
  }
  return stats;
};

export const fetchStatsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchStats(getState())) {
    return dispatch(fetchStats());
  }
};