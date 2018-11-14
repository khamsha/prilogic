import { combineReducers } from 'redux'
import {
  SELECT_STORE, RESET_STORE,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

const selectedStore = (state = 'All shipments', action) => {
  switch (action.type) {
    case SELECT_STORE:
      return action.storeId
    default:
      return state
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

const rootReducer = combineReducers({
  posts,
  postsByStoreId,
  selectedStore
})

export default rootReducer