import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loader = () => {
  return (
    <div className="root_loader">
      <CircularProgress></CircularProgress>
    </div>
  );
};

export default Loader;
