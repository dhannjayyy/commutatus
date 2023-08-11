import React from "react";
import DropdownTeam from "./DropdownTeam";
import DropdownHeading from "./DropdownHeading";
import { getDepartments } from "../../utils/Slices/departmentSlice";
import { useSelector } from "react-redux";
import { getEmployee } from "../../utils/Slices/employeeSlice";

const DropdownDepartment = () => {
  const selectDepartment = useSelector(getDepartments);
  const selectEmployee = useSelector(getEmployee);

  return (
    <div className={`department-dropdown-container dropdown-margin-left`}>
      {selectDepartment.ids.map((departmentID) => {
        let department = selectDepartment.entities[departmentID];
        let departmentName = department.name;
        let departmentHeadName = selectEmployee.entities[department.head]?.name;
        let departmentTeams = department.teams;
        return (
          <div
            key={`${departmentID}`}
            className="department-container dropdown-margin-top"
          >
            <DropdownHeading
              entityID={department.head}
              heading={`${departmentHeadName} (${departmentName})`}
              customClass={["department-dropdown","department-head"]}
            />
            <DropdownTeam departmentTeams={departmentTeams}/>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownDepartment;
