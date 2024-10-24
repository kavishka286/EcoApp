// store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
  cart: [],
};

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_ITEM_AMOUNT = 'UPDATE_ITEM_AMOUNT';

// Action Creators
export const addToCart = (item) => ({ type: ADD_TO_CART, payload: item });
export const removeFromCart = (id) => ({ type: REMOVE_FROM_CART, payload: id });
export const updateItemAmount = (id, amount) => ({
  type: UPDATE_ITEM_AMOUNT,
  payload: { id, amount },
});

// Reducer
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        // If the item already exists, increase the amount
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].amount += action.payload.amount;
        return { ...state, cart: updatedCart };
      }
      // If the item does not exist, add it to the cart with amount set to 1
      return { ...state, cart: [...state.cart, { ...action.payload, amount: 1 }] };
    }
    case REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case UPDATE_ITEM_AMOUNT:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, amount: action.payload.amount } : item
        ),
      };
    default:
      return state;
  }
};

// Create store
const store = createStore(cartReducer);

export default store;
