import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer } from './reducers/productReducers';

// combining the different reducers
const reducer = combineReducers({
  productList: productListReducer,
});

// state set when the redux store gets loaded
const initialState = {};

// middleware that wi
const middleware = [thunk];

// creating store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
