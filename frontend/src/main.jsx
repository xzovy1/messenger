import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import AuthLayout from "./AuthLayout.jsx";
import HomeLayout from "./HomeLayout.jsx";
import ErrorPage from "./Error.jsx";
const routes = [
 {
  path: '/',
  children: [
    {
      path: "auth",
      Component: AuthLayout,
      children: [
        {path: 'log-in', Component: Login},
        {path: 'sign-up', Component: Signup}
      ]
    },
    {
      path: "home",
      Component: HomeLayout,
      errorElement: <ErrorPage />,
    }
  ]
 }
]
const router = createBrowserRouter(routes)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
);
