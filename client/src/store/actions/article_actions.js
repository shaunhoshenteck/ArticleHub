import * as articles from "./index";
import axios from "axios";
import { getAuthHeader } from "../../utils/tools";

axios.defaults.headers.post["Content-Type"] = "applications/json";

export const getArticles = (sort) => {
  return async (dispatch, getState) => {
    try {
      const arts = await axios.post(`/api/articles/loadmore`, sort);
      const prevArts = getState().articles.articles;
      let newArts = [...arts.data];

      if (prevArts) {
        newArts = [...prevArts, ...arts.data];
      }

      dispatch(articles.getArticles(newArts));
      // dispatch(articles.successGlobal("Awesome"));
    } catch (err) {
      dispatch(articles.errorGlobal(`Error Loading Articles`));
      articles.clearNotifications();
    }
  };
};

export const getArticle = (id) => {
  return async (dispatch) => {
    try {
      const request = await axios.get(`/api/articles/get_byid/${id}`);
      dispatch(articles.getArticle(request.data[0]));
    } catch (err) {
      dispatch(articles.errorGlobal(err.response.data.message));
    }
  };
};

export const addArticle = (article) => {
  return async (dispatch) => {
    try {
      const request = await axios.post(
        `/api/articles/admin/add_articles`,
        article,
        getAuthHeader()
      );

      dispatch(articles.addArticle(request.data));
      dispatch(articles.successGlobal("Successfully uploaded article!"));
    } catch (err) {
      dispatch(articles.errorGlobal(err.response.data.message));
    }
  };
};

export const getPaginateArticles = (page = 1, limit = 5) => {
  return async (dispatch) => {
    try {
      const request = await axios.post(
        `/api/articles/admin/paginate`,
        { page, limit },
        getAuthHeader()
      );
      dispatch(articles.getPaginatArticles(request.data));
    } catch (err) {
      dispatch(articles.errorGlobal(err.response.data.message));
    }
  };
};

export const changeStatusArticle = (status, _id) => {
  return async (dispatch, getState) => {
    try {
      const article = await axios.patch(
        `/api/articles/admin/${_id}`,
        { status: status },
        getAuthHeader()
      );
      let art = article.data;
      let state = getState().articles.adminArticles.docs; // Previous State
      let position = state.findIndex((art) => art._id === _id); // Find position
      state[position] = art;
      dispatch(articles.updateArticleStatus(state));
      dispatch(articles.successGlobal("Updated Successfully"));
    } catch (err) {
      dispatch(articles.errorGlobal(err.response.data.message));
    }
  };
};

export const deleteArticle = (id) => {
  return async (dispatch, getState) => {
    try {
      const article = await axios.delete(
        `/api/articles/admin/${id}`,
        getAuthHeader()
      );
      let state = getState().articles.adminArticles.docs;
      let filtered = state.filter((article) => article._id !== id);
      dispatch(articles.deleteArticle(filtered));
      dispatch(articles.successGlobal("Delete Successful"));
    } catch (err) {
      dispatch(articles.errorGlobal(err.response.data.message));
    }
  };
};

export const getAdminArticle = (id) => {
  return async (dispatch) => {
    try {
      const request = await axios.get(
        `/api/articles/admin/${id}`,
        getAuthHeader()
      );

      dispatch(articles.getArticle(request.data));
    } catch (err) {
      dispatch(articles.getArticle(err.response.data.message));
    }
  };
};

export const updateArticle = (article, id) => {
  return async (dispatch) => {
    try {
      const newArticle = await axios.patch(
        `/api/articles/admin/${id}`,
        article,
        getAuthHeader()
      );
      dispatch(articles.getArticle(newArticle.data));
      dispatch(articles.successGlobal("Update Complete!"));
    } catch (err) {
      dispatch(articles.errorGlobal("Error, try again"));
    }
  };
};

export const getCategories = () => {
  return async (dispatch) => {
    try {
      const categories = await axios.get("/api/articles/categories");
      dispatch(articles.getCategories(categories.data));
    } catch (err) {
      dispatch(articles.errorGlobal("Error, try again"));
    }
  };
};

export const addCategory = (values) => {
  return async (dispatch, getState) => {
    try {
      const category = await axios.post(
        "/api/articles/categories",
        values,
        getAuthHeader()
      );

      let newState = [...getState().articles.categories, category.data];
      dispatch(articles.addCategory(newState));
      dispatch(articles.successGlobal("Successfully added category"));
    } catch (err) {
      dispatch(articles.errorGlobal("Error, try again"));
    }
  };
};

export const getSearchNavResults = (page = 1, limit = 5, keywords = "") => {
  return async (dispatch) => {
    try {
      const request = await axios.post(`/api/articles/user/search`, {
        keywords,
        page,
        limit,
      });
      dispatch(articles.NavSearch(request.data));
    } catch (err) {
      dispatch(articles.errorGlobal("Error, try again"));
    }
  };
};
