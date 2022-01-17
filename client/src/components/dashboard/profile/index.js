import React from "react";
import AdminLayout from "../../../hoc/adminLayout";
import AuthProfile from "./auth";
import UserProfile from "./profile";

const Profile = () => {
  return (
    <AdminLayout section="Profile">
      <AuthProfile></AuthProfile>
      <UserProfile></UserProfile>
    </AdminLayout>
  );
};

export default Profile;
