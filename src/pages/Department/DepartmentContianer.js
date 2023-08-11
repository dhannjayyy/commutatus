import React from "react";
import { useParams } from "react-router-dom";
import { getEmployee } from "../../utils/Slices/employeeSlice";
import { useSelector } from "react-redux";
import { getDepartments } from "../../utils/Slices/departmentSlice";
import DepartmentCard from "../../components/Department/DepartmentCard";


const DepartmentContainer = () => {
  const params = useParams();
  const selectDepartment = useSelector(getDepartments);
  const selectEmployee = useSelector(getEmployee);
  const activeDepartmentRef = selectDepartment.entities[params.departmentID];
  const activeEmployeeRef = selectEmployee.entities[activeDepartmentRef?.head];

  return (
    <>
        <DepartmentCard
          activeEmployeeRef={activeEmployeeRef}
          departmentID={params.departmentID}
          showEditButton={false}
          showAddTeamButton={true}
        />
    </>
  );
};

export default DepartmentContainer;
