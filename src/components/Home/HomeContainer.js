import React from "react";
import Sidebar from "../Layout components/Sidebar";
import Mainpage from "./Mainpage";

const HomeContainer = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <Mainpage />
    </div>
  );
};

export default HomeContainer;
