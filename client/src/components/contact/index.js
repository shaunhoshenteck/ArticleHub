import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/loader";
import { contactUs } from "../../store/actions/user_actions";

import { TextField, Button } from "@material-ui/core";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: "", firstname: "", lastname: "", message: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Sorry this email is required")
        .email("This is not a valid email"),
      firstname: Yup.string().required("Sorry this firstname is required"),
      lastname: Yup.string().required("Sorry this lastname is required"),
      message: Yup.string()
        .required("Sorry, you need to write something")
        .max(500, "Sorry, the message is too long"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      dispatch(contactUs(values));
    },
  });

  useEffect(() => {
    if (notifications && notifications.success) {
      formik.resetForm();
      setLoading(false);
    }
  }, [notifications]);

  const errorHelper = (formik, values) => {
    return {
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText:
        formik.errors[values] && formik.touched[values]
          ? formik.errors[values]
          : null,
    };
  };

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          <h1>Contact Us</h1>
          <form className="mt-3" onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <TextField
                style={{ width: "100%" }}
                name="email"
                label="Enter Your Email"
                variant="outlined"
                {...formik.getFieldProps("email")}
                {...errorHelper(formik, "email")}></TextField>
            </div>
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
                name="message"
                label="Add Your Message Here"
                variant="outlined"
                multiline
                rows={4}
                {...formik.getFieldProps("message")}
                {...errorHelper(formik, "message")}></TextField>
            </div>
            <Button variant="contained" color="primary" type="submit">
              Send Us a Message
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default Contact;
