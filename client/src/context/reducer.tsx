import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_ERROR,
  LOGOUT_USER,
} from "./actions";

import { initialState, InitialStateProps } from "./appContext";

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
      userLoading: false,
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
  if (action.type === GET_CURRENT_USER_ERROR) {
    return {
      ...state,
      userLoading: false,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
    };
  }
  throw new Error(`No such action :${action.type}`);
};
export default reducer;
