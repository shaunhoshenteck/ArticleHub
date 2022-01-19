import React, { useEffect, useState, useReducer } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import {
  Modal,
  Button,
  ButtonToolbar,
  ButtonGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPaginateArticles } from "../../../store/actions/article_actions";
import PaginationComponent from "./paginate";
import {
  changeStatusArticle,
  deleteArticle,
} from "../../../store/actions/article_actions";
import Loader from "../../../utils/loader";

const Articles = (props) => {
  const dispatch = useDispatch();
  const [removeAlert, setRemoveAlert] = useState(false);
  const [elementToRemove, setElementToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { value: "", memory: "" }
  );
  let limit = 5;
  const articles = useSelector((state) => state.articles);
  let arts = articles.adminArticles;

  const handleCloseModal = () => {
    setRemoveAlert(false);
  };

  const handleShowModal = (id = null) => {
    setElementToRemove(id);
    setRemoveAlert(true);
  };

  const goToPrevPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const goToNextPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const handleStatusChange = (status, _id) => {
    let newStatus = status === "draft" ? "public" : "draft";
    dispatch(changeStatusArticle(newStatus, _id));
  };

  const editArticleAction = (id) => {
    props.history.push(`/dashboard/articles/edit/${id}`);
  };

  const handleDelete = () => {
    dispatch(deleteArticle(elementToRemove));
    setRemoveAlert(false);
    dispatch(getPaginateArticles(arts.page));
  };

  const triggerSearch = (e) => {
    e.preventDefault();
    if (searchValues.value !== "") {
      setSearchValues({ memory: searchValues.value });
    }
  };

  const resetSearch = () => {
    setSearchValues({ memory: "", value: "" });
    dispatch(getPaginateArticles(1, limit));
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getPaginateArticles(1, limit, searchValues.memory));
  }, [dispatch, searchValues.memory, limit]);

  useEffect(() => {
    setLoading(false);
  }, [articles]);

  useEffect(() => {
    dispatch(getPaginateArticles());
  }, [dispatch]);

  return (
    <AdminLayout section="Articles">
      <div className="articles_table">
        <ButtonToolbar className="mb-3">
          <ButtonGroup className="mr-2">
            <LinkContainer to="/dashboard/articles/add">
              <Button variant="secondary">Add article</Button>
            </LinkContainer>
          </ButtonGroup>
          <form onSubmit={triggerSearch}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={(e) => setSearchValues({ value: e.target.value })}
                type="text"
                value={searchValues.value}
                placeholder="Example"></FormControl>
            </InputGroup>
          </form>
        </ButtonToolbar>
        {loading ? (
          <Loader></Loader>
        ) : (
          <>
            <div>
              {searchValues.memory !== "" ? (
                <div>
                  <p>
                    Your search for <b>"{searchValues.memory}"</b> had{" "}
                    <b>{articles.adminArticles.totalDocs}</b> result
                  </p>
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => resetSearch()}>
                    RESET SEARCH
                  </span>
                </div>
              ) : null}
            </div>
          </>
        )}
        <PaginationComponent
          arts={arts}
          prev={(page) => goToPrevPage(page)}
          next={(page) => goToNextPage(page)}
          handleStatusChange={(status, id) => handleStatusChange(status, id)}
          editArticleAction={(id) => editArticleAction(id)}
          handleShowModal={(id) => handleShowModal(id)}></PaginationComponent>

        <Modal show={removeAlert} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Are you really sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Deletions will be permanent.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>

            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Articles;
