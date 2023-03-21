import React, { useState, useReducer, useContext, useEffect } from "react";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_ERROR,
  GET_CURRENT_USER_SUCCESS,
  LOGOUT_USER,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
} from "./actions";
import reducer, { ActionType } from "./reducer";
import axios from "axios";

type User = {
  fullName: string;
  userId: string;
  role: string;
};

export type InitialStateProps = {
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
  displayAlert: () => void;
  clearAlert: () => void;
  user: User | null;
  setupUser: (
    currentUser: object,
    endPoint: string,
    alertText: string
  ) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  userLoading: boolean;
  logoutUser: () => Promise<void>;
};

export const initialState: InitialStateProps = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  displayAlert: () => {},
  clearAlert: () => {},
  user: null,
  setupUser: async () => {},
  getCurrentUser: async () => {},
  userLoading: false,
  logoutUser: async () => {},
};
const AppContext = React.createContext<InitialStateProps>(initialState);

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<InitialStateProps, ActionType>
  >(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.log("Unauthorized error!");
        // logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 3000);
  };

  const setupUser = async (
    currentUser: object,
    endPoint: string,
    alertText: string
  ) => {
    dispatch({ type: SETUP_USER_BEGIN });

    try {
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user: data.tokenUser, alertText },
      });
    } catch (error: any) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });

    try {
      const { data } = await authFetch.get("/auth/getCurrentUser");
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user: data.tokenUser },
      });
    } catch (error: any) {
      if (error.response.status === 401) return;
      // logoutUser();
    }
  };

  const logoutUser = async () => {
    await authFetch("/auth/logout");
    dispatch({ type: LOGOUT_USER });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        setupUser,
        getCurrentUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
