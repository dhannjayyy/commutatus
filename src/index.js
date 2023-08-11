import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./utils/reduxStore";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TeamContainer from "./pages/Team/TeamContainer";
import DepartmentContainer from "./pages/Department/DepartmentContianer";
import AddTeam from "./pages/Team/AddTeam";
import Home from "./pages/Home/Home";
import HomeContainer from "./components/Home/HomeContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <HomeContainer />,
      },
      {
        path: "/teams/:teamID",
        element: <TeamContainer />,
      },
      {
        path: "/department/:departmentID",
        element: <DepartmentContainer />,
      },
      {
        path: "/department/:departmentID/addteam",
        element: <AddTeam />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
