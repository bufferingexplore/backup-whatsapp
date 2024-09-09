import DashboardPage from "./DashboardPage";
import React from "react";
import { cookies } from "next/headers";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Dashboard",
};

export default function Page() {
  return <DashboardPage />;
}
