import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Register,
  Login,
  VerifyOTPPage,
  ProfilePage,
  HomePage,
  SearchPage,
  UserPostViewer,
} from "@pages";
import { Layout } from "@layouts";
import { CreatePost, ProtectedRoute, PublicRoute } from "@components";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route
            path="/profile/:username/post/:postId"
            element={<UserPostViewer />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
