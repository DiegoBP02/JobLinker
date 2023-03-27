import React, { useState, useReducer, useContext, useEffect } from "react";
import {
  CLEAR_ALERT,
  CLEAR_APPLICANTS,
  CLEAR_VALUES,
  CREATE_INTERVIEW_BEGIN,
  CREATE_INTERVIEW_ERROR,
  CREATE_INTERVIEW_SUCCESS,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  DELETE_INTERVIEW_BEGIN,
  DELETE_INTERVIEW_ERROR,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  DISPLAY_ALERT,
  EDIT_INTERVIEW_BEGIN,
  EDIT_INTERVIEW_ERROR,
  EDIT_INTERVIEW_SUCCESS,
  GET_ALL_INTERVIEWS_BEGIN,
  GET_ALL_INTERVIEWS_ERROR,
  GET_ALL_INTERVIEWS_SUCCESS,
  GET_ALL_COMPANY_JOBS_BEGIN,
  GET_ALL_COMPANY_JOBS_ERROR,
  GET_ALL_COMPANY_JOBS_SUCCESS,
  GET_APPLICANTS_BEGIN,
  GET_APPLICANTS_ERROR,
  GET_APPLICANTS_SUCCESS,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  HANDLE_CHANGE,
  LOGOUT_USER,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
  SET_EDIT_INTERVIEW,
  TOGGLE_APPLICANTS,
  TOGGLE_SIDEBAR,
  UPDATE_STATUS_BEGIN,
  UPDATE_STATUS_ERROR,
  GET_ALL_JOBS_BEGIN,
  GET_ALL_JOBS_SUCCESS,
  GET_ALL_JOBS_ERROR,
} from "./actions";
import reducer, { ActionType } from "./reducer";
import axios from "axios";
import moment from "moment";

export type User = {
  fullName: string;
  userId: string;
  role: string;
};

export type JobProps = {
  position: string;
  company: string;
  location: string;
  createdAt: string;
  description: string;
  salary: number;
  _id: string;
  type: string;
  key: any;
};

export type ApplicantProps = {
  _id: string;
  resume: string;
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    _id: string;
  };
  portfolio: {
    title: string;
    url: string;
    _id: string;
  };
  certifications?: string[];
  education: {
    degree: string;
    instituition: string;
    location: string;
    graduation: string;
    _id: string;
  };
  status: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  job: string;
  createdAt: string;
  updatedAt: string;
};

export type InterviewProps = {
  _id: string;
  position: string;
  companyId: {
    _id: string;
    fullName: string;
    email: string;
  };
  message: string;
  status: string;
  date: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  job: {
    _id: string;
    position: string;
    location: string;
    salary: number;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
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
  getCompanyJobs: () => void;
  jobs: JobProps[] | null;
  totalJobs: number;
  deleteJob: (id: string) => Promise<void>;
  getApplicants: (id: string) => Promise<void>;
  applicants: ApplicantProps[] | null;
  totalApplicants: number;
  showApplicants: boolean;
  toggleApplicants: () => void;
  updateStatus: (
    applicantId: string,
    jobId: string,
    status: string
  ) => Promise<void>;
  message: string;
  date: string;
  createInterview: (userId: string, jobId: string) => Promise<void>;
  time: number;
  interviews: InterviewProps[] | null;
  totalInterviews: number;
  getInterviews: () => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  clearApplicants: () => void;
  setEditInterview: (id: string) => void;
  editInterview: () => Promise<void>;
  isEditingInterview: boolean;
  editInterviewId: string;
  getAllJobs: () => Promise<void>;
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
  showSidebar: false,
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
  getCompanyJobs: () => {},
  jobs: null,
  totalJobs: 0,
  deleteJob: async () => {},
  getApplicants: async () => {},
  applicants: null,
  totalApplicants: 0,
  showApplicants: false,
  toggleApplicants: () => {},
  updateStatus: async () => {},
  message: "",
  date: "",
  createInterview: async () => {},
  time: 16,
  interviews: [],
  totalInterviews: 0,
  getInterviews: async () => {},
  deleteInterview: async () => {},
  clearApplicants: () => {},
  setEditInterview: () => {},
  editInterview: async () => {},
  isEditingInterview: false,
  editInterviewId: "",
  getAllJobs: async () => {},
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
      dispatch({ type: CLEAR_VALUES });
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

  const getCompanyJobs = async () => {
    dispatch({ type: GET_ALL_COMPANY_JOBS_BEGIN });

    try {
      const { user } = state;
      const { data } = await authFetch.get(`/jobs/company/${user?.userId}`);
      const { jobs, totalCount: totalJobs } = data;
      dispatch({
        type: GET_ALL_COMPANY_JOBS_SUCCESS,
        payload: { jobs, totalJobs },
      });
    } catch (error: any) {
      dispatch({
        type: GET_ALL_COMPANY_JOBS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const deleteJob = async (id: string) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${id}`);
      getCompanyJobs();
    } catch (error: any) {
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const getApplicants = async (id: string) => {
    dispatch({ type: GET_APPLICANTS_BEGIN });

    try {
      const { data } = await authFetch.get(`/jobs/job/${id}`);
      const { singleJobApplicants, totalCount: totalApplicants } = data;

      dispatch({
        type: GET_APPLICANTS_SUCCESS,
        payload: { singleJobApplicants, totalApplicants },
      });
    } catch (error: any) {
      dispatch({
        type: GET_APPLICANTS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const toggleApplicants = () => {
    dispatch({ type: TOGGLE_APPLICANTS });
  };

  const updateStatus = async (
    applicantId: string,
    jobId: string,
    status: string
  ) => {
    dispatch({ type: UPDATE_STATUS_BEGIN });

    try {
      await authFetch.patch(`/jobs/user/${applicantId}`, { status });

      getApplicants(jobId);
    } catch (error: any) {
      dispatch({
        type: UPDATE_STATUS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const createInterview = async (userId: string, jobId: string) => {
    dispatch({ type: CREATE_INTERVIEW_BEGIN });

    try {
      const formattedDate = moment(state.date, "YYYY/MM/DD")
        .hours(state.time)
        .toISOString();

      const formattedData = {
        message: state.message,
        date: formattedDate,
        user: userId,
        job: jobId,
      };

      await authFetch.post("/interview", formattedData);

      dispatch({ type: CREATE_INTERVIEW_SUCCESS });
      clearValues();
    } catch (error: any) {
      dispatch({
        type: CREATE_INTERVIEW_ERROR,
        payload: { msg: error.response.data.msg },
      });
      console.log(error);
    }
  };

  const getInterviews = async () => {
    dispatch({ type: GET_ALL_INTERVIEWS_BEGIN });

    try {
      const { data } = await authFetch.get("/interview/company");
      const { interviews, totalCount: totalInterviews } = data;

      dispatch({
        type: GET_ALL_INTERVIEWS_SUCCESS,
        payload: { interviews, totalInterviews },
      });
    } catch (error: any) {
      dispatch({
        type: GET_ALL_INTERVIEWS_ERROR,
        payload: { msg: error.response.data.msg },
      });
      clearAlert();
    }
  };

  const setEditInterview = (id: string) => {
    dispatch({ type: SET_EDIT_INTERVIEW, payload: { id } });
  };

  const editInterview = async () => {
    dispatch({ type: EDIT_INTERVIEW_BEGIN });
    const { message, date, time, editInterviewId } = state;

    const formattedDate = moment(date, "YYYY/MM/DD").hours(time).toISOString();

    try {
      await authFetch.patch(`/interview/${editInterviewId}`, {
        message,
        date: formattedDate,
      });

      dispatch({ type: EDIT_INTERVIEW_SUCCESS });
      clearAlert();
      clearValues();
    } catch (error: any) {
      dispatch({
        type: EDIT_INTERVIEW_ERROR,
        payload: { msg: error.response.data.msg },
      });
      clearAlert();
      clearValues();
    }
  };

  const deleteInterview = async (id: string) => {
    dispatch({ type: DELETE_INTERVIEW_BEGIN });

    try {
      await authFetch.delete(`/interview/${id}`);
      getInterviews();
    } catch (error: any) {
      dispatch({
        type: DELETE_INTERVIEW_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const clearApplicants = () => {
    dispatch({ type: CLEAR_APPLICANTS });
  };

  const getAllJobs = async () => {
    dispatch({ type: GET_ALL_JOBS_BEGIN });

    try {
      const { data } = await authFetch.get("jobs");
      const { jobs, totalCount } = data;

      dispatch({
        type: GET_ALL_JOBS_SUCCESS,
        payload: { jobs, totalJobs: totalCount },
      });
    } catch (error: any) {
      dispatch({
        type: GET_ALL_JOBS_ERROR,
        payload: { msg: error.response.data.msg },
      });
      clearAlert();
    }
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
        getCompanyJobs,
        deleteJob,
        getApplicants,
        toggleApplicants,
        updateStatus,
        createInterview,
        getInterviews,
        deleteInterview,
        clearApplicants,
        setEditInterview,
        editInterview,
        getAllJobs,
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
