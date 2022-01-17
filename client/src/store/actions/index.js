import {
  GET_ARTICLES,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATIONS,
  AUTH_USER,
  SIGN_OUT,
  SITE_LAYOUT,
  GET_ARTICLE,
  CLEAR_CURRENT_ARTICLE,
  ADD_ARTICLE,
  GET_ADMIN_ARTICLES,
  UPDATE_ARTICLE_STATUS,
  DELETE_ARTICLE,
  CHANGE_USER_EMAIL,
  UPDATE_USER_PROFILE,
} from "../types";

// ARTICLES

export const getArticles = (articles) => {
  return { type: GET_ARTICLES, payload: articles };
};

export const getArticle = (article) => {
  return { type: GET_ARTICLE, payload: article };
};

export const clearCurrentArticle = () => {
  return { type: CLEAR_CURRENT_ARTICLE };
};

export const addArticle = (article) => {
  return { type: ADD_ARTICLE, payload: article };
};

export const getPaginatArticles = (articles) => {
  return { type: GET_ADMIN_ARTICLES, payload: articles };
};

export const updateArticleStatus = (article) => {
  return { type: UPDATE_ARTICLE_STATUS, payload: article };
};

export const deleteArticle = (article) => {
  return { type: DELETE_ARTICLE, payload: article };
};

// NOTIFICATIONS

export const errorGlobal = (msg) => {
  return { type: ERROR_GLOBAL, payload: msg };
};

export const successGlobal = (msg) => {
  return { type: SUCCESS_GLOBAL, payload: msg };
};

export const clearNotifications = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_NOTIFICATIONS });
  };
};

// USERS

export const authUser = (user) => {
  return { type: AUTH_USER, payload: user };
};

export const signOut = () => {
  return { type: SIGN_OUT };
};

export const changeUserEmail = (data) => {
  return { type: CHANGE_USER_EMAIL, payload: data };
};

export const updateUserProfile = (userData) => {
  return { type: UPDATE_USER_PROFILE, payload: userData };
};

// SITE
export const appLayout = (layout) => {
  return { type: SITE_LAYOUT, payload: layout };
};
