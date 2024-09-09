import DevicePage from "./DevicePage";
import React from "react";
import { cookies } from "next/headers";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Link Device",
};

export default function Page() {
  return <DevicePage />;
}
