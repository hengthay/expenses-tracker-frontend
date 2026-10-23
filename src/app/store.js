import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import userReducer from "../feature/user/userSlice";
import categoryReducer from "../feature/categories/categorySlice";
import accountReducer from "../feature/accounts/accountSlice";
import transactionReducer from "../feature/transactions/transactionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    categories: categoryReducer,
    accounts: accountReducer,
    transactions: transactionReducer
  }
})

export default store;