import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth";
import uiReducer from "./features/ui";
import preferencesReducer from "./features/preferences";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "preferences"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  preferences: preferencesReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
