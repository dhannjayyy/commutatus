import React from "react";
import "./Mainpage.scss";
import { useSelector } from "react-redux";
import EmployeeCard from "../Employee/EmployeeCard";
import TeamCard from "../Teams/TeamCard";
import { getEmployee } from "../../utils/Slices/employeeSlice";
import { getUtilities } from "../../utils/Slices/utilitySlice";
import DepartmentCard from "../Department/DepartmentCard";
import { getDepartments } from "../../utils/Slices/departmentSlice";


const Mainpage = () => {
  const selectUtilities = useSelector(getUtilities);
  const selectEmployee = useSelector(getEmployee);
  const selectDepartment = useSelector(getDepartments);
  const activeEmployeeRef =
  selectEmployee.entities[selectUtilities.activeEntity];
  let activeDepartmentID;

  if(selectUtilities.type === "employee" && activeEmployeeRef.position === "head") {
    selectDepartment.ids.forEach((department) => {
      if (selectDepartment.entities[department].head === activeEmployeeRef.id) {
        activeDepartmentID = department;
      }
    });
  }

  return (
    <div className="homepage-container">
      <div className="homepage-content-box">
        {selectUtilities.type === "employee" &&
        activeEmployeeRef.position === "head" ? (
            <DepartmentCard
              activeEmployeeRef={activeEmployeeRef}
              showEditButton={true}
              departmentID={activeDepartmentID}
            />
        ) : selectUtilities.type === "employee" ? (
            <EmployeeCard activeEmployeeRef={activeEmployeeRef} />
        ) : selectUtilities.type === "team" ? (
            <TeamCard
              teamID={selectUtilities.activeEntity}
              showEditButton={true}
            />
        ) : (
          "Please click on any employee / team / department head to view details"
        )}
      </div>
    </div>
  );
};

export default Mainpage;
