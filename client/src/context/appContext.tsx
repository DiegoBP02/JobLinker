import React, { useState, useReducer, useContext, useEffect } from "react";
import {
  CLEAR_ALERT,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  DISPLAY_ALERT,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  HANDLE_CHANGE,
  LOGOUT_USER,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
  TOGGLE_SIDEBAR,
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
  showSidebar: boolean;
  toggleSidebar: () => void;
  handleChange: (name: string, value: string) => void;
  position: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  jobTypeOptions: string[];
  company: string;
  createJob: () => void;
  clearValues: () => void;
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
  showSidebar: true,
  toggleSidebar: () => {},
  handleChange: () => {},
  position: "",
  description: "",
  location: "",
  salary: 0,
  jobType: "full-time",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  company: "",
  createJob: () => {},
  clearValues: () => {},
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
    await authFetch.get("/auth/logout");
    dispatch({ type: LOGOUT_USER });
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const handleChange = (name: string, value: string) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const { position, description, location, salary, jobType: type } = state;

      await authFetch.post("/jobs", {
        position,
        description,
        location,
        salary,
        type,
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      clearAlert();
    } catch (error: any) {
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
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
        toggleSidebar,
        handleChange,
        createJob,
        clearValues,
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
