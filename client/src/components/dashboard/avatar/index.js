import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminLayout from "../../../hoc/adminLayout";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { uploadAvatar } from "../../../store/actions/user_actions";
import Loader from "../../../utils/loader";

const Avatar = () => {
  // const [customImage, setCustomImage] = useState("");
  const [loading, setLoading] = useState(false);
  const users = useSelector((state) => state.users);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: { archive: "" },
    validationSchema: Yup.object({
      archive: Yup.mixed().required("A file is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      let formData = new FormData();
      formData.append("file", values.archive);
      // Multer
      //   axios
      //     .post("/api/files/multerupload", formData, {
      //       header: { "content-type": "multipart/form-data" },
      //     })
      //     .then((response) => {
      //       console.log(response);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });

      // Cloudinary
      axios
        .post("/api/files/testupload", formData, {
          header: { "content-type": "multipart/form-data" },
        })
        .then((response) => {
          // console.log(response.data.url);
          // setCustomImage(response.data.url);
          dispatch(uploadAvatar(response.data.url, users.data._id));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    if (notifications && notifications.error) {
      setLoading(false);
    }

    if (notifications && notifications.success) {
      setLoading(false);
    }
  }, [notifications]);

  return (
    <AdminLayout section="Avatar">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.File
            id="file"
            name="file"
            label="Upload Your Avatar"
            onChange={(event) => {
              formik.setFieldValue("archive", event.target.files[0]);
            }}></Form.File>
          {formik.errors.archive && formik.touched.archive ? (
            <div className="mt-2" style={{ color: "red" }}>
              Error
            </div>
          ) : null}
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
      {users.data && users.data.avatar ? (
        <>
          {loading ? (
            <Loader></Loader>
          ) : (
            <div className="mt-3 d-flex justify-content-center">
              <img
                style={{ width: "50%", height: "50%" }}
                alt="avatar"
                src={users.data.avatar}></img>
            </div>
          )}
        </>
      ) : loading ? (
        <Loader></Loader>
      ) : null}
    </AdminLayout>
  );
};

export default Avatar;
