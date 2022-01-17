import React from "react";
import { useFormik } from "formik";
import AdminLayout from "../../../hoc/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../../store/actions/user_actions";

import { TextField, Divider, Button } from "@material-ui/core";

const UserProfile = () => {
  const { firstname, lastname, age } = useSelector((state) => state.users.data);
  const dispatch = useDispatch();

  const errorHelper = (formik, values) => {
    return {
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText:
        formik.errors[values] && formik.touched[values]
          ? formik.errors[values]
          : null,
    };
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { firstname, lastname, age },
    onSubmit: (values, { resetform }) => {
      dispatch(updateUserProfile(values));
    },
  });
  return (
    <form
      className="mt-3"
      style={{ maxWidth: "250px" }}
      article_form
      onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <TextField
          style={{ width: "100%" }}
          name="firstname"
          label="Enter Your Firstname"
          variant="outlined"
          {...formik.getFieldProps("firstname")}
          {...errorHelper(formik, "firstname")}></TextField>
      </div>
      <div className="form-group">
        <TextField
          style={{ width: "100%" }}
          name="lastname"
          label="Enter Your Lastname"
          variant="outlined"
          {...formik.getFieldProps("lastname")}
          {...errorHelper(formik, "lastname")}></TextField>
      </div>
      <div className="form-group">
        <TextField
          style={{ width: "100%" }}
          name="age"
          label="Enter Your Age"
          variant="outlined"
          {...formik.getFieldProps("age")}
          {...errorHelper(formik, "age")}></TextField>
      </div>
      <Button
        type="submit"
        className="mt-3"
        variant="contained"
        color="primary"
        Edit
        Profile>
        Edit Profile
      </Button>
    </form>
  );
};

export default UserProfile;
