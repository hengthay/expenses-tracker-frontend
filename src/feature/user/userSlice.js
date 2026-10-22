import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../components/APIConfig";

const initialState = {
  usersData: [],
  status: "idle",
  error: null,
  userDataDetail: null,
  statusDetail: "idle",
  userErrorDetail: null
}

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/users');

      if(!res?.data)
        return thunkAPI.rejectWithValue("No users found.");

      console.log('User response: ', res?.data);

      return res?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to fetch users: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);

      if(!res?.data)
        return thunkAPI.rejectWithValue("No users found.");

      console.log('User response: ', res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to fetch users: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser', async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/users', formData);

      if(!res?.data) 
        return thunkAPI.rejectWithValue("Failed to create user.");

      console.log("User Created Response: ", res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to create user: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser', async ({id, formData}, thunkAPI) => {
    try { 
      const res = await axiosInstance.put(`/users/${id}`, formData);

      if(!res?.data) 
        return thunkAPI.rejectWithValue("Failed to update user.");

      console.log('User Updated Response: ', res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to update user: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateUserByAdmin = createAsyncThunk(
  'users/updateUserByAdmin', async ({id, payload}, thunkAPI) => {
    try { 
      const res = await axiosInstance.put(`/users/${id}/admin`, payload);

      if(!res?.data) 
        return thunkAPI.rejectWithValue("Failed to update user by admin.");

      console.log('User Updated Response: ', res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to update user by admin: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser', async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/users/${id}`);

      if(res?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Error to delete user!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to delete user: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const changeUserPassword = createAsyncThunk(
  'users/changeUserPassword', async ({id, formData}, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/users/${id}/change-password`, formData);

      if(!res?.data) 
        return thunkAPI.rejectWithValue("Failed to change user password.");

      console.log("User Password Updated Response: ", res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to change user password: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.usersData = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.statusDetail = 'loading';
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.statusDetail = 'succeeded';
        state.userErrorDetail = null;
        state.userDataDetail = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.statusDetail = 'failed';
        state.userErrorDetail = action.payload || "Something went wrong.";
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.usersData = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updatedUser = action.payload;

        state.usersData = state.usersData.map((user) => user.id === updatedUser.id ? updatedUser : user);

        state.userDataDetail = updatedUser;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(updateUserByAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updatedUser = action.payload;

        state.usersData = state.usersData.map((user) => user.id === updatedUser.id ? updatedUser : user);

        state.userDataDetail = updatedUser;
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const deletedUser = action.payload;

        state.usersData = state.usersData.filter((user) => user.id !== deletedUser.id);

        if(state.userDataDetail?.id === deletedUser.id) {
          state.userDataDetail = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updatedUser = action.payload;

        state.usersData = state.usersData.map((user) => user.id === updateUser.id ? updatedUser : user);

        state.userDataDetail = updatedUser;        
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong.";
      })
  }
});

export default userSlice.reducer;
export const { resetUserStatus } = userSlice.actions;
export const selectUsers = state => state.users.usersData;
export const selectUserStatus = state => state.users.status;
export const selectUserError = state => state.users.error;
export const selectUserDataDetail = state => state.users.userDataDetail;
export const selectUserStatusDetail = state => state.users.statusDetail;
export const selectUserErrorDetail = state => state.users.userErrorDetail;