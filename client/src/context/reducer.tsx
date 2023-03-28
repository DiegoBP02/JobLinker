import moment from "moment";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  LOGOUT_USER,
  TOGGLE_SIDEBAR,
  HANDLE_CHANGE,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  CLEAR_VALUES,
  GET_ALL_COMPANY_JOBS_BEGIN,
  GET_ALL_COMPANY_JOBS_SUCCESS,
  GET_ALL_COMPANY_JOBS_ERROR,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  GET_APPLICANTS_BEGIN,
  GET_APPLICANTS_SUCCESS,
  GET_APPLICANTS_ERROR,
  TOGGLE_APPLICANTS,
  UPDATE_STATUS_BEGIN,
  UPDATE_STATUS_ERROR,
  CREATE_INTERVIEW_BEGIN,
  CREATE_INTERVIEW_SUCCESS,
  CREATE_INTERVIEW_ERROR,
  GET_ALL_INTERVIEWS_BEGIN,
  GET_ALL_INTERVIEWS_SUCCESS,
  GET_ALL_INTERVIEWS_ERROR,
  DELETE_INTERVIEW_BEGIN,
  DELETE_INTERVIEW_ERROR,
  CLEAR_APPLICANTS,
  SET_EDIT_INTERVIEW,
  EDIT_INTERVIEW_BEGIN,
  EDIT_INTERVIEW_ERROR,
  EDIT_INTERVIEW_SUCCESS,
  GET_ALL_JOBS_BEGIN,
  GET_ALL_JOBS_ERROR,
  GET_ALL_JOBS_SUCCESS,
  SET_COMPANY_ID,
  HANDLE_ADD_CERTIFICATION,
  HANDLE_REMOVE_CERTIFICATION,
  CREATE_APPLICATION_BEGIN,
  CREATE_APPLICATION_SUCCESS,
  CREATE_APPLICATION_ERROR,
} from "./actions";

import { initialState, InitialStateProps, InterviewProps } from "./appContext";

export type ActionType = {
  type: string;
  payload?: any;
};

const reducer: React.Reducer<InitialStateProps, ActionType> = (
  state,
  action
) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values!",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }
  if (action.type === SETUP_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      showAlert: true,
      alertType: "success",
      alertText: action.payload.alertText,
    };
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_CURRENT_USER_BEGIN) {
    return {
      ...state,
      userLoading: true,
      showAlert: false,
    };
  }
  if (action.type === GET_CURRENT_USER_SUCCESS) {
    return {
      ...state,
      userLoading: false,
      user: action.payload.user,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return { ...state, showSidebar: !state.showSidebar };
  }
  if (action.type === HANDLE_CHANGE) {
    return { ...state, [action.payload.name]: action.payload.value };
  }
  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Successful! Job created!",
    };
  }
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === CLEAR_VALUES) {
    return {
      ...state,
      isLoading: false,
      position: "",
      description: "",
      location: "",
      salary: 0,
      jobType: "full-time",
      message: "",
      date: "",
      time: 15,
      isEditingInterview: false,
      editInterviewId: "",
      companyId: "",
    };
  }
  if (action.type === GET_ALL_COMPANY_JOBS_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === GET_ALL_COMPANY_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
    };
  }
  if (action.type === GET_ALL_COMPANY_JOBS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_APPLICANTS_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === GET_APPLICANTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      applicants: action.payload.singleJobApplicants,
      totalApplicants: action.payload.totalApplicants,
    };
  }
  if (action.type === GET_APPLICANTS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_APPLICANTS) {
    return {
      ...state,
      showApplicants: !state.showApplicants,
    };
  }
  if (action.type === UPDATE_STATUS_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_STATUS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === CREATE_INTERVIEW_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_INTERVIEW_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Successful! Interview created!",
    };
  }
  if (action.type === CREATE_INTERVIEW_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_ALL_INTERVIEWS_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === GET_ALL_INTERVIEWS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      interviews: action.payload.interviews,
      totalInterviews: action.payload.totalInterviews,
    };
  }
  if (action.type === GET_ALL_INTERVIEWS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
      interviews: [],
      totalInterviews: 0,
    };
  }
  if (action.type === DELETE_INTERVIEW_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_INTERVIEW_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === CLEAR_APPLICANTS) {
    return {
      ...state,
      applicants: [],
      totalApplicants: 0,
      showApplicants: false,
    };
  }
  if (action.type === SET_EDIT_INTERVIEW) {
    const interview = state.interviews?.find(
      (int) => int._id === action.payload.id
    );
    const { _id, message, date } = interview as InterviewProps;
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return {
      ...state,
      isEditingInterview: true,
      editInterviewId: _id,
      message,
      date: formattedDate,
    };
  }
  if (action.type === EDIT_INTERVIEW_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === EDIT_INTERVIEW_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Successful! Interview updated!",
    };
  }
  if (action.type === EDIT_INTERVIEW_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_ALL_JOBS_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === GET_ALL_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
    };
  }
  if (action.type === GET_ALL_JOBS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
      jobs: [],
      totalJobs: 0,
    };
  }
  if (action.type === SET_COMPANY_ID) {
    return { ...state, companyId: action.payload.companyId };
  }
  if (action.type === HANDLE_ADD_CERTIFICATION) {
    const { index, value } = action.payload;
    const updatedCertification = [...state.certifications];
    updatedCertification[index] = value;
    return { ...state, certifications: updatedCertification };
  }
  if (action.type === HANDLE_REMOVE_CERTIFICATION) {
    const updatedCertifications = state.certifications.filter(
      (_, i) => i !== action.payload
    );
    return { ...state, certifications: updatedCertifications };
  }
  if (action.type === CREATE_APPLICATION_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_APPLICATION_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Successful! Application created!",
    };
  }
  if (action.type === CREATE_APPLICATION_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  throw new Error(`No such action :${action.type}`);
};
export default reducer;
