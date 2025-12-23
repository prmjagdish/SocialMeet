import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@context/AuthContext.jsx";
import { SuggestedUsersProvider } from "@context/SuggestedUsersProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SuggestedUsersProvider>
          <App />
        </SuggestedUsersProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
