import { combineReducers } from 'redux'
import {
  SELECT_STORE, RESET_STORE,
  REQUEST_POSTS, RECEIVE_POSTS, CREATE_NODE, RECEIVE_STATS, REQUEST_STATS
} from '../actions'

const selectedStore = (state = 'All shipments', action) => {
  switch (action.type) {
    case SELECT_STORE:
      return action.storeId
    default:
      return state
  }
}

const nodeList = (state = ["All shipments", "ALTU", "TULA", "VEGAS"], action) => {
  switch (action.type) {
    case CREATE_NODE:
    return action.nodeList;
    default:
    return state;
  }
}

const posts = (state = {
  isFetching: false,
  didReset: false,
  items: []
}, action) => {
  switch (action.type) {
    case RESET_STORE:
      return {
        ...state,
        didReset: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didReset: false
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didReset: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const postsByStoreId = (state = { }, action) => {
  switch (action.type) {
    case RESET_STORE:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.storeId]: posts(state[action.storeId], action)
      }
    default:
      return state
  }
}


const stats = (state = {
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_STATS:
      return {
        ...state,
      }
    case RECEIVE_STATS:
      return {
        ...state,
        items: action.stats,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  stats,
  nodeList,
  posts,
  postsByStoreId,
  selectedStore
})

export default rootReducer