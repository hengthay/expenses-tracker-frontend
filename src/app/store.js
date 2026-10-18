import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import userReducer from "../feature/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer
  }
})

export default store;