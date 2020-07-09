import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import { takeEvery, takeLatest, put } from "redux-saga/effects";
import swal from "sweetalert"

function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: "CLEAR_REGISTRATION_ERROR" });

    // passes the username and password from the payload to the server
    yield axios.post("/api/user/register", action.payload);

    // automatically log a user in after registration
    yield put({ type: "LOGIN", payload: action.payload });

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: "SET_TO_LOGIN_MODE" });
  } catch (error) {
    console.log("Error with user registration:", error);
    yield put({ type: "REGISTRATION_FAILED" });
  }
}

function* loginUser(action) {
  try {
    // clear any existing error on the login page
    yield put({ type: "CLEAR_LOGIN_ERROR" });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // send the action.payload as the body
    // the config includes credentials which
    // allow the server session to recognize the user
    yield axios.post("/api/user/login", action.payload, config);

    // after the user has logged in
    // get the user information from the server
    yield put({ type: "FETCH_USER" });
    swal(`welcome back! ${action.payload.username}`, {
      icon: "success"
    })
  } catch (error) {
    console.log("Error with user login:", error);
    if (error.response.status === 401) {
      // The 401 is the error status sent from passport
      // if user isn't in the database or
      // if the username and password don't match in the database
      yield put({ type: "LOGIN_FAILED" });
      swal("invalid login, please try again" , {
        icon: "warning"
      })
    } else {
      // Got an error that wasn't a 401
      // Could be anything, but most common cause is the server is not started
      yield put({ type: "LOGIN_FAILED_NO_CODE" });
    }
  }
}

// worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // when the server recognizes the user session
    // it will end the session
    yield axios.post("/api/user/logout", config);

    // now that the session has ended on the server
    // remove the client-side user object to let
    // the client-side code know the user is logged out
    yield put({ type: "UNSET_USER" });
  } catch (error) {
    console.log("Error with user logout:", error);
  }
}

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}


function* fetchMusic() {
  //runs GET on /music to grab all music and AVG ratings from database
  try {
    const response = yield axios.get("/music");
    console.log("fetch music:", response.data)
    yield put({ type: "SET_MUSIC", payload: response.data });
  } catch (error) {
    console.log("error fetch music", error);
  }
}

function* postSearch(action) {
  //runs POST on path /music/search to generate a search query from the database
  try {
    const response = yield axios.post(`/music/search`, action.payload);
    console.log("response.data", response.data)
    yield put({ type: "SET_SEARCH", payload: response.data });
  } catch (error) {
    console.log("Error posting search:", error);
  }
}

function* postMusic(action) {
  //runs POST on path /music to post new song to database
  try {
    console.log(action.payload);
    yield axios.post(`/music`, action.payload);
    yield put({ type: "FETCH_MUSIC" });
  } catch (error) {
    console.log("Error deleting recommendation:", error);
  }
}

function* postRate(action) {
  //runs PUT on path /music/rate to place a rating on a song in database
  try {
    console.log(action.payload);
    yield axios.post(`/music/rate`, action.payload);
    yield put({ type: "FETCH_MUSIC" });
  } catch (error) {
    console.log("Error deleting recommendation:", error);
  }
}

function* deleteMusic(action) {
  //runs DELETE on path /music/:id to delete selected song from database
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    //with DELETE, does not need response
    yield axios.delete(`/music/${action.payload}`, config);
    yield put({ type: "FETCH_MUSIC" });
  } catch (error) {
    console.log("Error deleting recommendation:", error);
  }
}

function* editMusic(action) {
  //runs PUT on path /music/:id to edit selected music item
  try {
    yield axios.put(`/music/${action.payload.id}`, action.payload.songData);
    yield put({ type: "FETCH_MUSIC" });
  } catch (error) {
    console.log("Error deleting recommendation:", error);
  }
}

function* rootSaga() {
  yield takeEvery("FETCH_MUSIC", fetchMusic); //fetchMusic goes to FETCH_MUSIC
  yield takeEvery("POST_SEARCH", postSearch); //postSearch goes to POST_SEARCH
  yield takeEvery('ADD_MUSIC', postMusic); //postMusic goes to ADD_MUSIC
  yield takeEvery('ADD_RATE', postRate); //postRate goes to ADD_RATE
  yield takeEvery("DELETE_MUSIC", deleteMusic); //deleteMusic goes to DELETE_MUSIC
  yield takeEvery("EDIT_MUSIC", editMusic); //editMusic goes to EDIT_MUSIC
    yield takeLatest("REGISTER", registerUser); //register goes to REGISTER
      yield takeLatest("LOGIN", loginUser); //loginUser goes to LOGIN
  yield takeLatest("LOGOUT", logoutUser); //logoutUser goes to LOGOUT
   yield takeLatest("FETCH_USER", fetchUser); //fetchUser goes to FETCH_USER
}

const sagaMiddleware = createSagaMiddleware();

//music reducer
const music = (state = [], action) => {
  switch (action.type) {
    case "SET_MUSIC":
      return action.payload;
    default:
      return state;
  }
};
//search reducer
const search = (state = [], action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return action.payload;
    default:
      return state;
  }
};
//user reducer
const user = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UNSET_USER":
      return {};
    default:
      return state;
  }
 //loginMode reducer
};
const loginMode = (state = "login", action) => {
  switch (action.type) {
    case "SET_TO_LOGIN_MODE":
      return "login";
    case "SET_TO_REGISTER_MODE":
      return "register";
    default:
      return state;
  }
  //loginMessage reducer
};
const loginMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_LOGIN_ERROR":
      return "";
    case "LOGIN_INPUT_ERROR":
      return "Enter your username and password!";
    case "LOGIN_FAILED":
      return "Oops! The username and password didn't match. Try again!";
    case "LOGIN_FAILED_NO_CODE":
      return "Oops! Something went wrong! Is the server running?";
    default:
      return state;
  }
};

// registrationMessage holds the string that will display
// on the registration screen if there's an error
const registrationMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_REGISTRATION_ERROR":
      return "";
    case "REGISTRATION_INPUT_ERROR":
      return "Choose a username and password!";
    case "REGISTRATION_FAILED":
      return "Oops! That didn't work. The username might already be taken. Try again!";
    default:
      return state;
  }
};
//store all reducers here
const storeInstance = createStore(
  combineReducers({
    music,
    search,
    user,
    loginMode,
    loginMessage,
    registrationMessage,
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);
//renders entire App to html file via id of root
ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));