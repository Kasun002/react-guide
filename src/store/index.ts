import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// configureStore wires reducers together and enables Redux DevTools automatically
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Infer types from the store so they always stay in sync with the actual shape
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
