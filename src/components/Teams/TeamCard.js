import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeCard from "../Employee/EmployeeCard";
import { getTeams, updateTeam } from "../../utils/Slices/teamSlice";
import { getEmployee } from "../../utils/Slices/employeeSlice";
import { Link, useHref } from "react-router-dom";
import { updateIndexedDB } from "../../utils/indexedDB";
import "./TeamCard.scss";
import EmployeeInfoForm from "../Employee/EmployeeInfoForm";

const TeamCard = ({ teamID, showEditButton }) => {
  const teamNameRef = useRef();
  const errorRef = useRef();
  const dialogRef = useRef();
  const [editingTeamName, setEditingTeamName] = useState(false);
  const showTeamNameEdit = useHref().includes("/teams");
  const selectTeam = useSelector(getTeams);
  const selectEmployee = useSelector(getEmployee);
  const teamsRef = selectTeam.entities;
  const teamsRefIds = selectTeam.ids;
  const dispatch = useDispatch();

  const getEmployeeRef = (employeeID) => {
    const activeEmployeeRef = selectEmployee?.entities[employeeID];
    return activeEmployeeRef;
  };

  const exisitingTeamChecker = (teamName) => {
    let flag = false;
    if (teamName === teamsRef[teamID]?.name) return false;
    teamsRefIds.forEach((team) => {
      if (teamsRef[team]?.name === teamName) {
        flag = true;
      }
    });
    return flag;
  };

  const editTeamNameHandler = (e) => {
    setEditingTeamName(!editingTeamName);
    if (e.target.textContent === "Save") {
      if (
        editingTeamName &&
        !exisitingTeamChecker(teamNameRef.current.innerText)
      ) {
        dispatch(
          updateTeam({
            id: teamID,
            changes: {
              name: teamNameRef.current.innerText,
            },
          })
        );
        updateIndexedDB("changeTeamName", {
          id: teamID,
          changes: { name: teamNameRef.current.innerText },
        });
        errorRef.current.textContent = "";
      } else {
        setEditingTeamName(true);
        errorRef.current.textContent =
          "A team with the given name already exists. Please try a different name.";
      }
    }
  };

  return (
    <>
      <div>
        <div className="team-header">
          <div className="team-name">
            <h2
              ref={teamNameRef}
              contentEditable={editingTeamName}
              suppressContentEditableWarning={true}
              style={
                editingTeamName
                  ? { outline: "2px solid black", width: "max-content" }
                  : {}
              }
            >
              {teamsRef[teamID]?.name}
            </h2>
            {showTeamNameEdit && (
              <button className="CTA-button" onClick={editTeamNameHandler}>
                {editingTeamName ? "Save" : "Edit Name"}
              </button>
            )}
          </div>
          {showTeamNameEdit && (
            <div className="CTA-container">
              <dialog ref={dialogRef} className="addMemberDialog">
                <EmployeeInfoForm dialogBox={dialogRef} operation={"add"} />
                <button
                  className="CTA-button add-member-cancel-button"
                  onClick={() => dialogRef.current.close()}
                >
                  Cancel
                </button>
              </dialog>
              <button
                className="CTA-button addMemberButton"
                onClick={() => dialogRef.current.showModal()}
              >
                Add member
              </button>
            </div>
          )}

          {showEditButton && (
            <Link to={`/teams/${teamID}`}>
              <button className="CTA-button">Edit</button>
            </Link>
          )}
        </div>
        <p className="error-message" ref={errorRef}></p>
        <div className="employee-cards-container">
          {getEmployeeRef(teamsRef[teamID]?.leader) && (
            <EmployeeCard
              activeEmployeeRef={getEmployeeRef(teamsRef[teamID]?.leader)}
            />
          )}
          {teamsRef[teamID]?.members.map((memberID) => {
            return (
              <div key={memberID}>
                {getEmployeeRef(memberID) && (
                  <EmployeeCard activeEmployeeRef={getEmployeeRef(memberID)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TeamCard;
