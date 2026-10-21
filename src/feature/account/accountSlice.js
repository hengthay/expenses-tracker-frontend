import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../components/APIConfig";

const initialState = {
  accountsData: [],
  status: "idle",
  error: null,
  accountDataDetail: {},
  accountStatusDetail: "idle",
  accountErrorDetail: null,
  allAccountsData: [],
  allAccountStatus: "idle",
  allAccountError: null
}

// Get all account for admin role
export const fetchAllAccounts = createAsyncThunk('accounts/fetchAllAccounts', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/accounts`);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("No accounts found.");
    }

    console.log("Reponse Data: ", res?.data);

    return res?.data ?? [];
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Error to fetch all accounts: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const fetchMyAccount = createAsyncThunk('accounts/fetchMyAccount', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/accounts/me`);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("No accounts found.");
    }

    console.log("Reponse Data: ", res?.data);

    return res?.data ?? [];
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Error to fetch my accounts: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const fetchByAccountId = createAsyncThunk('accounts/fetchByAccountId', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/accounts/${id}`);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("No account found.");
    }

    console.log("Reponse Data: ", res?.data);

    return res?.data ?? null;
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Error to fetch account: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const createAccount = createAsyncThunk('accounts/createAccount', async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/accounts`, payload);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("Failed to create account.");
    }

    console.log("Response Account Created: ", res?.data);

    return res?.data ?? null;
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Unable to create account: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const updateAccount = createAsyncThunk('accounts/updateAccount', async ({ id, payload }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/accounts/${id}`, payload);

    if(!res?.data) {
      return thunkAPI.rejectWithValue("Failed to update account.");
    }

    console.log("Response Account Updated: ", res?.data);

    return res?.data ?? null;
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Unable to update account: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

export const deleteAccount = createAsyncThunk('accounts/deleteAccount', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.delete(`/accounts/${id}`);

    if(res?.status === 200 || res?.status === 204) return id;

    return thunkAPI.rejectWithValue("Failed to delete account, it might be having active transaction. Please delete transactions first.");
  } catch (error) {
    const msg = error?.response?.data?.message; 
    console.log('Unable to delete account: ' + msg);
    return thunkAPI.rejectWithValue(msg);
  }
})

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    resetAccountStatus: (state) => {
      state.accountStatusDetail = "idle";
      state.allAccountStatus = "idle";
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAccounts.pending, (state) => {
        state.allAccountStatus = "loading";
        state.allAccountError = null;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.allAccountStatus = "succeeded";
        state.allAccountError = null;
        state.allAccountsData = action.payload;
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.allAccountStatus = "failed";
        state.allAccountError = action.payload || "Something went wrong!";
      })

      .addCase(fetchMyAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.accountsData = action.payload;
      })
      .addCase(fetchMyAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      
      .addCase(fetchByAccountId.pending, (state) => {
        state.accountStatusDetail = "loading";
        state.accountErrorDetail = null;
      })
      .addCase(fetchByAccountId.fulfilled, (state, action) => {
        state.accountStatusDetail = "succeeded";
        state.accountErrorDetail = null;
        state.accountDataDetail = action.payload;
      })
      .addCase(fetchByAccountId.rejected, (state, action) => {
        state.accountStatusDetail = "failed";
        state.accountErrorDetail = action.payload || "Something went wrong!";
      })

      .addCase(createAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        if (Array.isArray(state.allAccountsData)) state.allAccountsData.push(action.payload);

        if (Array.isArray(state.accountsData)) state.accountsData.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;

        if(Array.isArray(state.allAccountsData)) {
          state.allAccountsData = state.allAccountsData.map((acc) => acc.id === updated.id ? updated : acc);
        }
        if(Array.isArray(state.accountsData)) {
          state.accountsData = state.accountsData.map((acc) => acc.id === updated.id ? updated : acc);
        }
        state.accountDataDetail = updated;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedId = action.payload;

        if(Array.isArray(state.allAccountsData)) {
          state.allAccountsData = state.allAccountsData.filter((acc) => acc.id !== deletedId);
        }

        if(Array.isArray(state.accountsData)) {
          state.accountsData = state.accountsData.filter((acc) => acc.id !== deletedId);
        }

        if(state.accountDataDetail?.id === deletedId) {
          state.accountDataDetail = null;
        }
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      });
  }
})

export default accountSlice.reducer;
export const { resetAccountStatus } = accountSlice.actions;
export const selectAllAccounts = state => state.accounts.allAccountsData;
export const selectAllAccountStatus = state => state.accounts.allAccountStatus;
export const selectAllAccountError = state => state.accounts.allAccountError;
export const selectAccounts = state => state.accounts.accountsData;
export const selectAccountStatus = state => state.accounts.status;
export const selectAccountError = state => state.accounts.error;
export const selectAccountDataDetail = state => state.accounts.accountDataDetail;
export const selectAccountStatusDetail = state => state.accounts.accountStatusDetail;
export const selectAccountErrorDetail = state => state.accounts.accountErrorDetail;