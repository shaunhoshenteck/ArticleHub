import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminArticle,
  updateArticle,
} from "../../../store/actions/article_actions";
import { clearCurrentArticle } from "../../../store/actions";
import WYSIWYG from "../../../utils/forms/wysiwyg";
import { formValues, validation } from "./validationSchema";
import Loader from "../../../utils/loader";
import {
  TextField,
  Button,
  Divider,
  Chip,
  Paper,
  InputBase,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const EditArticle = (props) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const articles = useSelector((state) => state.articles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorBlur, setEditorBlur] = useState(false);
  const [formData, setFormData] = useState(formValues);
  const actorsValue = useRef("");

  // Edit
  const [editContent, setEditContent] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formData,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      dispatch(updateArticle(values, props.match.params.id));
    },
  });

  const handleEditorState = (state) => {
    formik.setFieldValue("content", state, true);
  };

  const handleEditorBlur = (blur) => {
    setEditorBlur(true);
  };

  const errorHelper = (formik, values) => {
    return {
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText:
        formik.errors[values] && formik.touched[values]
          ? formik.errors[values]
          : null,
    };
  };

  useEffect(() => {
    // if (notifications && notifications.success) {
    //   props.history.push("/dashboard/articles");
    // }

    // if (notifications && notifications.error) {
    setIsSubmitting(false);
    // }
  }, [notifications]);

  // EDIT PART

  useEffect(() => {
    dispatch(getAdminArticle(props.match.params.id));
  }, [dispatch, props.match.params]);

  useEffect(() => {
    if (articles && articles.current) {
      setFormData(articles.current);
      setEditContent(articles.current.content);
    }
  }, [articles]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [dispatch]);

  return (
    <AdminLayout section="Add article">
      {isSubmitting ? (
        <Loader></Loader>
      ) : (
        <form className="mt-3 article_form" onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              label="Enter a title"
              name="title"
              variant="outlined"
              {...formik.getFieldProps("title")}
              {...errorHelper(formik, "title")}></TextField>
          </div>

          <div className="form-group">
            <WYSIWYG
              setEditorState={(state) => handleEditorState(state)}
              setEditorBlur={(blur) => handleEditorBlur(blur)}
              editContent={editContent}></WYSIWYG>
            {formik.errors.content && editorBlur ? (
              <FormHelperText error={true}>
                {formik.errors.content}
              </FormHelperText>
            ) : null}

            {/* Hot fix, mirroring as we can't access wysiwyg via formik */}
            <TextField
              type="hidden"
              name="content"
              {...formik.getFieldProps("content")}></TextField>
          </div>

          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              label="Enter an excerpt"
              name="excerpt"
              variant="outlined"
              {...formik.getFieldProps("excerpt")}
              {...errorHelper(formik, "excerpt")}
              multiline
              rows={4}></TextField>
          </div>
          <Divider className="mt-3 mb-3"></Divider>
          <h5>Movie Data and Score</h5>
          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              label="Score"
              name="score"
              variant="outlined"
              {...formik.getFieldProps("score")}
              {...errorHelper(formik, "score")}></TextField>
          </div>

          <FormikProvider value={formik}>
            <h5>Add the actors</h5>
            <FieldArray
              name="actors"
              render={(arrayhelpers) => {
                return (
                  <div>
                    <Paper className="actors_form">
                      <InputBase
                        inputRef={actorsValue}
                        className="input"
                        placeholder="Add actor name here"></InputBase>
                      <IconButton
                        onClick={() => {
                          if (actorsValue.current.value) {
                            arrayhelpers.push(actorsValue.current.value);
                            actorsValue.current.value = "";
                          }
                        }}>
                        <AddIcon></AddIcon>
                      </IconButton>
                    </Paper>
                    {formik.errors.actors && formik.touched.actors ? (
                      <FormHelperText error={true}>
                        {formik.errors.actors}
                      </FormHelperText>
                    ) : null}
                    <div className="chip_container">
                      {formik.values.actors.map((actor, index) => (
                        <div key={actor}>
                          <Chip
                            onDelete={() => arrayhelpers.remove(index)}
                            label={`${actor}`}
                            color="primary"></Chip>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}></FieldArray>
          </FormikProvider>

          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              label="Director"
              name="director"
              variant="outlined"
              {...formik.getFieldProps("director")}
              {...errorHelper(formik, "director")}></TextField>
          </div>

          <FormControl variant="outlined">
            <h5>Select Status</h5>
            <Select
              name="status"
              {...formik.getFieldProps("status")}
              error={
                formik.errors.status && formik.touched.status ? true : false
              }>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="draft">
                <em>Draft</em>
              </MenuItem>
              <MenuItem value="public">
                <em>Public</em>
              </MenuItem>
            </Select>
            {formik.errors.status && formik.touched.status ? (
              <FormHelperText error={true}>
                {formik.errors.status}
              </FormHelperText>
            ) : null}
          </FormControl>

          <Divider className="mt-3 mb-3"></Divider>
          <Button
            variant="contained"
            color="primary"
            disabled={false}
            type="submit">
            Edit article
          </Button>
        </form>
      )}
    </AdminLayout>
  );
};

export default EditArticle;
