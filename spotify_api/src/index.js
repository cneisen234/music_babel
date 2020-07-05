import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import Axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchMusic() {
  try {
    const response = yield Axios.get("/music");
    console.log("fetch music:", response.data)
    yield put({ type: "SET_MUSIC", payload: response.data });
  } catch (error) {
    console.log("error fetch music", error);
  }
}

function* rootSaga() {
  //fetchMovies goes to FETCH_MOVIES
  yield takeEvery("FETCH_MUSIC", fetchMusic);
}

const sagaMiddleware = createSagaMiddleware();

const music = (state = [], action) => {
  switch (action.type) {
    case "SET_MUSIC":
      return action.payload;
    default:
      return state;
  }
};

const storeInstance = createStore(
  combineReducers({
    music,
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);
//renders entire App to html file via id of root
ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));