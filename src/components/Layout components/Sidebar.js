import React from "react";
import "./Sidebar.scss";
import {  useSelector } from "react-redux";
import {  getEmployee } from "../../utils/Slices/employeeSlice";
import DropdownHeading from "./DropdownHeading";
import DropdownDepartment from "./DropdownDepartment";

const Sidebar = () => {
  const selectEmployee = useSelector(getEmployee);
  const employeeEntitySelector = selectEmployee.entities;


  return (
    <div className="sidebar-container">
      <div className="parent-dropdown-container dropdown-margin-left">
        <DropdownHeading
          entityID={selectEmployee.CEO}
          heading={employeeEntitySelector[selectEmployee.CEO]?.name}
          customClass={["outermost-dropdown", "ceo"]}
        />
        <DropdownDepartment />
      </div>
    </div>
  );
};

export default Sidebar;
