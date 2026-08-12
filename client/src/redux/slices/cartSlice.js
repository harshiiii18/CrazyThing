import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { productId, title, price, image, sellerName, quantity }
  subtotal: 0,
  status: "idle", // idle | loading
};

// Maps the backend's populated cart response into the flat shape the UI uses.
export function mapServerCart({ items = [], subtotal = 0 }) {
  return {
    items: items.map((i) => ({
      productId: i.product._id,
      title: i.product.title,
      price: i.product.price,
      image: i.product.images?.[0]?.url,
      sellerName: i.product.seller?.name || "Seller",
      quantity: i.quantity,
    })),
    subtotal,
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      const mapped = mapServerCart(action.payload);
      state.items = mapped.items;
      state.subtotal = mapped.subtotal;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
