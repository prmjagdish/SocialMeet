import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ProfileProvider from "@context/ProfileProvider.jsx";
import { AuthProvider } from "@context/AuthContext.jsx";
import { SuggestedUsersProvider } from "@context/SuggestedUsersProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <SuggestedUsersProvider>
          <App />
        </SuggestedUsersProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>
);
