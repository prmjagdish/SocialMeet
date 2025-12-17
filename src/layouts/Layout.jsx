import React from "react";
import Sidebar from "@components/sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-h-screen bg-white rounded-l-xl">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
