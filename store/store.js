import { createStore, applyMiddleware, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'

const userInitialState = {}

const LOGOUT = 'LOGOUT'

function userReducer(state = userInitialState, action) {
  switch(action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer
})

export function logout() {
  return dispatch => {
    axios.post('/logout').then(res => {
      if (res.status === 200) {
        dispatch({
          type: LOGOUT
        })
      } else {
        console.log('logout failed', res)
      }
    }).catch(e => {
      console.log(e)
    })
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )

  return store
}