import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import './index.css';
import App from './App';
import reducer from './reducers'
import reduxThunk from 'redux-thunk'


let store = createStore(reducer, {}, applyMiddleware(reduxThunk))




ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>, 
    document.getElementById('root'));

