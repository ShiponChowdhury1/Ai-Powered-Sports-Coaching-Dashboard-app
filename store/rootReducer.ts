import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "@/features/users/usersSlice";
import subscriptionsReducer from "@/features/subscriptions/subscriptionsSlice";
import trainingReducer from "@/features/training/trainingSlice";
import supportReducer from "@/features/support/supportSlice";
import settingsReducer from "@/features/settings/settingsSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";

export const rootReducer = combineReducers({
  users: usersReducer,
  subscriptions: subscriptionsReducer,
  training: trainingReducer,
  support: supportReducer,
  settings: settingsReducer,
  dashboard: dashboardReducer,
});
