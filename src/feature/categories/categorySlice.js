import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../components/APIConfig";

const initialState = {
  categoriesData: [],
  status: "idle",
  error: null,
  categoryDataDetail: null,
  statusDetail: "idle",
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/categories`);

      if(!res?.data) return thunkAPI.rejectWithValue("No categories found.");

      console.log('Category: ', res?.data);

      return res?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to load categories";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/categories/${id}`);

      if(!res?.data) return thunkAPI.rejectWithValue("No category found.");

      console.log('Category: ', res?.data);
      
      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to load category details";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/categories`, payload);

      if(!res?.data) return thunkAPI.rejectWithValue("Error to create category.");

      console.log('Category: ', res?.data);
      
      return res?.data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to create category";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, payload }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/categories/${id}`, payload);

      if(!res?.data) return thunkAPI.rejectWithValue("Error to update category.");

      console.log('Category: ', res?.data);
      
      return res?.data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Error to update category";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/categories/${id}`);

      if(res?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Error to delete category.");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to delete category";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryDetail: (state) => {
      state.categoryDataDetail = null;
      state.statusDetail = "idle";
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
    resetCategoryStatus: (state) => {
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.categoriesData = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.statusDetail = "loading";
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.statusDetail = "succeeded";
        state.categoryDataDetail = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.statusDetail = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        if(Array.isArray(state.categoriesData)) {
          state.categoriesData = action.payload;
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;

        if(Array.isArray(state.categoriesData)) {
          state.categoriesData = state.categoriesData.map((cate) => cate.id === updated.id ? updated : cate);
        }
        state.categoryDataDetail = updated;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedId = action.payload;

        if(Array.isArray(state.categoriesData)) {
          state.categoriesData = state.categoriesData.filter((cate) => cate.id !== deletedId);
        }
        if(state.categoryDataDetail?.id === deletedId) {
          state.categoryDataDetail = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export const { clearCategoryDetail, clearCategoryError, resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
export const selectAllCategories = state => state.categories.categoriesData;
export const selectCategoryStatus = state => state.categories.status;
export const selectCategoryError = state => state.categories.error;
export const selectCategoryById = state => state.categories.categoryDataDetail;
export const selectCategoryStatusDetail = state => state.categories.statusDetail;
