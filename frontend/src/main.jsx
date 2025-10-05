import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, redirect } from "react-router";
import "./index.css";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import AuthLayout from "./AuthLayout.jsx";
import HomeLayout from "./HomeLayout.jsx";
import ErrorPage from "./Error.jsx";
import App from "./App.jsx"

const authMiddleware = async ({ context }) => {
  console.log(context)

  throw redirect('/auth/login')
}

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: 'log-in', Component: Login },
      { path: 'sign-up', Component: Signup }
    ]
  },
  {
    path: "home",
    Component: HomeLayout,
    index: true,
    errorElement: <ErrorPage />,
  }
]
const router = createBrowserRouter(routes)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
