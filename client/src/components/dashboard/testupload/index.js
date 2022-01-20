import React, { useState, useEffect } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const TestUpload = () => {
  const [customImage, setCustomImage] = useState("");
  const formik = useFormik({
    initialValues: { archive: "" },
    validationSchema: Yup.object({
      archive: Yup.mixed().required("A file is required"),
    }),
    onSubmit: (values) => {
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
          console.log(response.data.url);
          setCustomImage(response.data.url);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

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
          {formik.errors.archive && formik.touched.archive ? <>Error</> : null}
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
      {customImage ? (
        <div className="mt-3 d-flex justify-content-center">
          <img style={{ width: "50%", height: "50%" }} src={customImage}></img>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default TestUpload;
