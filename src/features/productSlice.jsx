import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import axios from "axios";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/product");

    return response.data;
  }
);

export const saveProduct = createAsyncThunk(
  "products/saveProduct",
  async ({ title, price }) => {
    const response = await axios.post("http://localhost:5000/product", {
      title,
      price,
    });

    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axios.delete(`http://localhost:5000/product/${id}`);
    return id;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, title, price }) => {
    const response = await axios.patch(`http://localhost:5000/product/${id}`, {
      title,
      price,
    });

    return response.data;
  }
);

const productEntity = createEntityAdapter({
  selectId: (product) => product.id,
});

const productSlice = createSlice({
  name: "product",
  initialState: productEntity.getInitialState(),
  extraReducers: {
    [getProducts.fulfilled]: (state, action) => {
      // *memasukan semua data
      productEntity.setAll(state, action.payload);
    },
    [saveProduct.fulfilled]: (state, action) => {
      productEntity.addOne(state, action.payload);
    },
    [deleteProduct.fulfilled]: (state, action) => {
      productEntity.removeOne(state, action.payload);
    },
    [updateProduct.fulfilled]: (state, action) => {
      productEntity.upsertOne(state, {
        id: action.payload.id,
        updates: action.payload,
      });
    },
  },
});

// const productSlice = createSlice({
//   name: "product",
//   initialState: {
//     title: "init product",
//     price: "0",
//   },
//   reducers: {
//     update: (state, action) => {
//       state.title = action.payload.title;
//       state.price = action.payload.price;
//     },
//   },
// });

// export const { update } = productSlice.actions;

export const productSelectors = productEntity.getSelectors(
  (state) => state.product
);
export default productSlice.reducer;
