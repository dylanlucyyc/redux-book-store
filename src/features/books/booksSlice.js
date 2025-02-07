// features/books/booksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiService";

const initialState = {
  books: [],
  pageNum: 1,
  query: "",
  loading: false,
  errorMessage: "",
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ pageNum, limit, query }, { rejectWithValue }) => {
    try {
      let url = `/books?_page=${pageNum}&_limit=${limit}`;
      if (query) url += `&q=${query}`;
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPageNum: (state, action) => {
      state.pageNum = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});

export const { setPageNum, setQuery } = booksSlice.actions;

export default booksSlice.reducer;
