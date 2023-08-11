import React from "react";
import EmployeeCard from "../Employee/EmployeeCard";
import { useSelector } from "react-redux";
import { getDepartments } from "../../utils/Slices/departmentSlice";
import TeamCard from "../Teams/TeamCard";
import { Link, useHref } from "react-router-dom";
import "./DepartmentCard.scss";

const DepartmentCard = ({
  activeEmployeeRef,
  departmentID,
  showEditButton,
  showAddTeamButton,
}) => {
  const selectDepartment = useSelector(getDepartments);
  const showTeamCardCTO = useHref().includes("/department");
  let activeDepartmentID;

  const getDepartmentTeams = () => {
    let teams;
    teams = selectDepartment.entities[departmentID]?.teams;
    activeDepartmentID = departmentID;
    return teams;
  };

  const departmentTeams = getDepartmentTeams();

  return (
    <>
      <div className="department-heading">
        <h1>Department {selectDepartment.entities[departmentID]?.name}</h1>
        {showEditButton && (
          <Link to={`/department/${activeDepartmentID}`}>
            <button className="CTA-button">Edit</button>
          </Link>
        )}
        {showAddTeamButton && (
          <Link to={`/department/${activeDepartmentID}/addteam`}>
            <button className="CTA-button">Add Team</button>
          </Link>
        )}
      </div>
      {activeEmployeeRef && (
        <EmployeeCard activeEmployeeRef={activeEmployeeRef} />
      )}
      {departmentTeams?.map((teamID) => {
        return (
          <div key={teamID}>
            <TeamCard teamID={teamID} showEditButton={showTeamCardCTO} />
          </div>
        );
      })}
    </>
  );
};

export default DepartmentCard;
