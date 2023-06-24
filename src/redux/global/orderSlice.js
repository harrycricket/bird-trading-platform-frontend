import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const orderSlice = createSlice({
   name: "orderSlice",
   initialState: {
      itemsByShop: [],
      paymentMethod: "",
      promotionIds: [],
      total: {
         subTotal: 0,
         shippingTotal: 0,
         promotionFee: 0,
         paymentTotal: 0,
      },
   },
   reducers: {
      updateItemsByShop: (state, action) => {
         let count = 0;
         state.itemsByShop = state.itemsByShop.map((item) => {
            if (item.shopId === action.payload.shopId) {
               count = count + 1;
               return action.payload;
            } else {
               return item;
            }
         });
         if (count === 0) {
            state.itemsByShop.push(action.payload);
         }
      },
      updateTotal: (state, action) => {
         state.total = action.payload;
      },
      updatePromotion: (state, action) => {
         if (action.payload.shipping) {
            state.promotionIds.push(action.payload.shipping.id);
         }
         if (action.payload.discount) {
            state.promotionIds.push(action.payload.discount.id);
         }
      },
   },
});

export default orderSlice;

export const orderSliceSelector = (state) => state.orderSlice;
