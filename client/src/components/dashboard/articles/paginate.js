import React from "react";
import { Table, Pagination } from "react-bootstrap";
import Moment from "react-moment";
import Loader from "../../../utils/loader";

const PaginationComponent = ({
  editArticleAction,
  arts,
  prev,
  next,
  handleStatusChange,
  handleShowModal,
}) => {
  const goToPrevPage = (page) => {
    prev(page);
  };

  const goToNextPage = (page) => {
    next(page);
  };

  return (
    <>
      {arts && arts.docs ? (
        <>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Create</th>
                <th>Title</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {arts.docs.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Moment to={item.date}></Moment>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.score}</td>
                  <td
                    className="action_btn remove_btn"
                    onClick={() => handleShowModal(item._id)}>
                    Remove
                  </td>
                  <td
                    className="action_btn edit_btn"
                    onClick={() => {
                      editArticleAction(item._id);
                    }}>
                    Edit
                  </td>
                  <td
                    className="action_btn status_btn"
                    onClick={() => {
                      handleStatusChange(item.status, item._id);
                    }}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {arts.hasPrevPage ? (
              <>
                <Pagination.Prev onClick={() => goToPrevPage(arts.prevPage)} />
                <Pagination.Item onClick={() => goToPrevPage(arts.prevPage)}>
                  {arts.prevPage}
                </Pagination.Item>
              </>
            ) : null}
            <Pagination.Item active>{arts.page}</Pagination.Item>
            {arts.hasNextPage ? (
              <>
                <Pagination.Item onClick={() => goToNextPage(arts.nextPage)}>
                  {arts.nextPage}
                </Pagination.Item>
                <Pagination.Next onClick={() => goToNextPage(arts.nextPage)} />
              </>
            ) : null}
          </Pagination>
        </>
      ) : (
        <Loader></Loader>
      )}
    </>
  );
};

export default PaginationComponent;
