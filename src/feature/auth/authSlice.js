import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../components/APIConfig";

const initialState = {
  userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null,
  user: null,
  status: "idle",
  error: null
}

export const loginUser = createAsyncThunk('auth/loginUser', async   (credential, thunkAPI) => {
  try {
    console.log("Redux store credential: ", credential);
    const res = await axiosInstance.post(`/auth/login`, credential, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if(!res?.data) {
      return thunkAPI.rejectWithValue("Failed to login!");
    }

    console.log("Reponse Data: ", res?.data);

    return res?.data ?? null;
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Error to login: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/auth/me`);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("Failed to get current user!");
    }

    console.log('Current User: ', res?.data);

    return res?.data ?? null;
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Error to fetch current user: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.userData = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("userData")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = action.payload;

        // Set token to localStorage
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
  }
});

export default authSlice.reducer;
export const { forceLogout } = authSlice.actions;
export const selectUserToken = state => state.auth.userData;
export const selectCurrentUser = state => state.auth.user;
export const selectUserStatus = state => state.auth.status;
export const selectUserError = state => state.auth.error;
export const selectRoleAdmin = state => state.auth.user?.role;