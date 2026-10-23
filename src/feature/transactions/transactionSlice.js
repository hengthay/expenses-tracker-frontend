import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../components/APIConfig";

const initialState = {
  allTransactionsData: [],
  allTransactionStatus: "idle",
  allTransactionError: null,
  transactionsData: [],
  status: "idle",
  error: null,
  transactionDataDetail: null,
  transactionStatusDetail: "idle",
  transactionErrorDetail: null
}

export const fetchAllTransactions = createAsyncThunk(
  'transactions/fetchAllTransactions', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/transactions');

      if(!res?.data) return thunkAPI.rejectWithValue("No transactions found.");

      console.log("All Transactions Response: ", res?.data);

      return res?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to fetch all transactions: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchMyTransactions = createAsyncThunk(
  'transactions/fetchMyTransactions', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/transactions/me');

      if(!res?.data) return thunkAPI.rejectWithValue("No transactions found.");

      console.log("Transactions Response: ", res?.data);

      return res?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to fetch transactions: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchTransactionById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/transactions/${id}`);

      if(!res?.data) return thunkAPI.rejectWithValue("No transactions found.");

      console.log("Transaction Response: ", res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to fetch transaction: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction', async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/transactions`, formData);

      if(!res?.data) return thunkAPI.rejectWithValue("Failed to create transaction.");

      console.log("Transaction Created Response: ", res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to create transaction: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction', async ({ id, payload }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/transactions/${id}`, payload);

      if(!res?.data) return thunkAPI.rejectWithValue("Failed to update transaction.");

      console.log("Transaction Updated Response: ", res?.data);

      return res?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to update transaction: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction', async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/transactions/${id}`);

      if(res?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Failed to delete transaction.");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Unable to delete transaction: ', msg)
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    resetTransactionStatus: (state) => {
      state.allTransactionStatus = "idle";
      state.transactionStatusDetail = "idle";
      state.status = "idle";
      state.allTransactionError = null;
      state.transactionErrorDetail = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.allTransactionStatus = "loading";
        state.allTransactionError = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.allTransactionStatus = "succeeded";
        state.allTransactionError = null;
        state.allTransactionsData = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.allTransactionStatus = "failed";
        state.allTransactionError = action.payload || "Something went wrong!";
      })

      .addCase(fetchMyTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.transactionsData = action.payload;
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      
      .addCase(fetchTransactionById.pending, (state) => {
        state.transactionStatusDetail = "loading";
        state.transactionErrorDetail = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.transactionStatusDetail = "succeeded";
        state.transactionErrorDetail = null;
        state.transactionDataDetail = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.transactionStatusDetail = "failed";
        state.transactionErrorDetail = action.payload || "Something went wrong!";
      })

      .addCase(createTransaction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        
        if(Array.isArray(state.allTransactionsData)) 
          state.allTransactionsData.push(action.payload);
        
        if(Array.isArray(state.transactionsData)) 
          state.transactionsData.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })

      .addCase(updateTransaction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const updated = action.payload;

        if(Array.isArray(state.allTransactionsData)) 
          state.allTransactionsData.map((tran) => tran.id === updated.id ? updated : tran);
        
        if(Array.isArray(state.transactionsData)) 
          state.transactionsData.map((tran) => tran.id === updated.id ? updated : tran);

        state.transactionDataDetail = updated;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })

      .addCase(deleteTransaction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const deletedId = action.payload;

        if(Array.isArray(state.allTransactionsData)) 
          state.allTransactionsData.filter((tran) => tran.id !== deletedId);
        
        if(Array.isArray(state.transactionsData)) 
          state.transactionsData.map((tran) => tran.id === deletedId);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
  }
})

export default transactionSlice.reducer;
export const { resetTransactionStatus } = transactionSlice.actions;
export const selectAllTransactions = state => state.transactions.allTransactionsData;
export const selectAllTransactionStatus = state => state.transactions.allTransactionStatus;
export const selectAllTransactionError = state => state.transactions.allTransactionError;
export const selectTransactions = state => state.transactions.transactionsData;
export const selectTransactionStatus = state => state.transactions.status;
export const selectTransactionError = state => state.transactions.error;
export const selectTransactionDataDetail = state => state.transactions.transactionDataDetail;
export const selectTransactionStatusDetail = state => state.transactions.transactionStatusDetail;
export const selectTransactionErrorDetail = state => state.transactions.transactionErrorDetail;