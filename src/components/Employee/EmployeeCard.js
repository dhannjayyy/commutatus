import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHref, useParams } from "react-router-dom";
import { getEmployee, removeEmployee } from "../../utils/Slices/employeeSlice";
import { getUtilities } from "../../utils/Slices/utilitySlice";
import { getTeams, updateTeam } from "../../utils/Slices/teamSlice";
import EmployeeInfoForm from "./EmployeeInfoForm";
import { getDepartments } from "../../utils/Slices/departmentSlice";
import { updateIndexedDB } from "../../utils/indexedDB";
import "./EmployeeCards.scss";

const EmployeeCard = ({ activeEmployeeRef }) => {
  const location = useHref();
  const removeEmployeeModalRef = useRef();
  const editEmployeeModalRef = useRef();
  const changeTeamDialogRef = useRef();
  const errorRef = useRef();
  const selectEmployee = useSelector(getEmployee);
  const selectDepartments = useSelector(getDepartments);
  const selectUtilities = useSelector(getUtilities);
  const selectTeams = useSelector(getTeams);
  const departmentIds = selectDepartments.ids;
  const departmentEntities = selectDepartments.entities;
  const dispatch = useDispatch();
  const params = useParams()
  const activeTeam =
    selectUtilities.type === "team"
      ? selectTeams.entities[selectUtilities.activeEntity]
      : selectTeams.entities[params.teamID];

  const departmentFinder = (teamID) => {
    let activeDepartmentID;
    departmentIds.forEach((departmentID) => {
      if (departmentEntities[departmentID].teams.includes(teamID)) {
        activeDepartmentID = departmentID;
      }
    });
    return activeDepartmentID;
  };

  const moveMemberHandler = (e) => {
    e.preventDefault();
    const teamToMoveTo =
      selectTeams.entities[e.target.elements.chooseTeam.value];
    try {
      dispatch(
        updateTeam({
          id: teamToMoveTo.id,
          changes: {
            members: [...teamToMoveTo.members, activeEmployeeRef.id],
          },
        })
      );
      updateIndexedDB("addMemberToTeam", {
        teamID: teamToMoveTo.id,
        changes: { members: [...teamToMoveTo.members, activeEmployeeRef.id] },
      });

      const newMembersAfterMoving = activeTeam.members.filter(
        (member) => member !== activeEmployeeRef.id
      );

      dispatch(
        updateTeam({
          id: activeTeam.id,
          changes: {
            members: newMembersAfterMoving,
          },
        })
      );
      updateIndexedDB("removeMemberFromTeam", {
        teamID: activeTeam.id,
        changes: { members: newMembersAfterMoving },
      });

      changeTeamDialogRef.current.close();
    } catch (error) {
      console.log(error);
      errorRef.current.textContent = "Something went wrong. Try again.";
      setTimeout(() => {
        errorRef.current.textContent = "";
      }, 5000);
      changeTeamDialogRef.current.close();
    }
  };
  const removeEmployeeModalOpener = () => {
    removeEmployeeModalRef.current.showModal();
  };

  const editInfoModalOpener = () => {
    editEmployeeModalRef.current.showModal();
  };

  const changeTeamDialogOpener = () => {
    changeTeamDialogRef.current.showModal();
  };

  const removeEmployeeHandler = () => {
    try {
      let tempMembers = [...activeTeam.members];
      let indexOfMemberToRemove = tempMembers.indexOf(activeEmployeeRef.id);
      tempMembers.splice(indexOfMemberToRemove, 1);
      dispatch(removeEmployee(activeEmployeeRef.id));
      updateIndexedDB("removeEmployee", activeEmployeeRef.id);

      dispatch(
        updateTeam({
          id: activeTeam.id,
          changes: {
            members: tempMembers,
          },
        })
      );
      updateIndexedDB("removeMemberFromTeam", {
        teamID: activeTeam.id,
        changes: { members: tempMembers },
      });
      removeEmployeeModalRef.current.close();
    } catch (err) {
      console.log(err);
      errorRef.current.textContent = "Something went wrong. Try again.";
      setTimeout(() => {
        errorRef.current.textContent = "";
      }, 5000);
      removeEmployeeModalRef.current.close();
    }
  };

  const RemoveEmployeeModal = ({ modalData }) => {
    return (
      <dialog ref={removeEmployeeModalRef} className="removeEmployeeModal">
        {activeTeam?.members.length > 1 ? (
          <>
            <h2>Remove Employee</h2>
            <p>Are you sure you want to remove this employee?</p>
            <p>{modalData?.name}</p>
            <p>{modalData?.position}</p>
            <p>{modalData?.phoneNumber}</p>
            <p>{modalData?.email}</p>
            <p>{modalData?.id}</p>
            <button className="CTA-button" onClick={removeEmployeeHandler}>Yes</button>
            <button className="CTA-button" onClick={() => removeEmployeeModalRef.current.close()}>
              No
            </button>
          </>
        ) : (
          <>
            <p>
              There has to be atleast one team member. Can not remove this
              member
            </p>
            <button className="CTA-button" onClick={() => removeEmployeeModalRef.current.close()}>
              Ok
            </button>
          </>
        )}
      </dialog>
    );
  };

  const ChangeTeamDialog = () => {
    const activeDepartmentID = departmentFinder(activeTeam?.id);
    return (
      <dialog ref={changeTeamDialogRef}>
        {departmentEntities[activeDepartmentID]?.teams.length === 1 ? (
          <>
            <p>
              There is only one team in this department. Can not move this
              member to another team.
            </p>
            <button className="CTA-button" onClick={() => changeTeamDialogRef.current.close()}>
              OK
            </button>
          </>
        ) : activeTeam?.members.length === 1 ? (
          <>
            <p>
              This is the only member of this team. Can not move it to another
              team.
            </p>
            <button className="CTA-button" onClick={() => changeTeamDialogRef.current.close()}>
              OK
            </button>
          </>
        ) : (
          <>
            <p>Move to another team</p>
            <form onSubmit={moveMemberHandler}>
              <label htmlFor="chooseTeam">Choose team : </label>
              <select id="chooseTeam" name="chooseTeam">
                {departmentEntities[activeDepartmentID]?.teams.map((teamID) => {
                  if (teamID !== activeTeam.id)
                    return (
                      <option value={teamID} key={teamID}>
                        {selectTeams.entities[teamID].name}
                      </option>
                    );
                })}
              </select>
              <button className="CTA-button" type="submit">Move</button>
            </form>
            <button className="CTA-button" onClick={() => changeTeamDialogRef.current.close()}>
              Cancel
            </button>
          </>
        )}
      </dialog>
    );
  };

  return (
    <>
      <div className="employee-content-card">
        <p>Name : {activeEmployeeRef?.name}</p>
        <p>Position : {activeEmployeeRef?.position}</p>
        <p>Phone Number : {activeEmployeeRef?.phoneNumber}</p>
        <p>Email : {activeEmployeeRef?.email}</p>
        <p>EmployeeID : {activeEmployeeRef?.id}</p>
        <div className="employee-action-buttons">
          {activeEmployeeRef?.position !== "leader" &&
            selectEmployee.ids.includes(activeEmployeeRef?.id) &&
            location.includes("/teams") && (
              <>
                <button
                  className="CTA-button"
                  onClick={removeEmployeeModalOpener}
                >
                  Remove
                </button>
                
                <RemoveEmployeeModal modalData={activeEmployeeRef} />
              </>
            )}
          {(activeEmployeeRef?.position === "CEO" ||
            location.includes("/teams") ||
            (activeEmployeeRef?.position === "head" &&
              location.includes("/department"))) && (
            <>
              <dialog ref={editEmployeeModalRef}>
                <EmployeeInfoForm
                  dialogBox={editEmployeeModalRef}
                  operation={"update"}
                  employeeData={activeEmployeeRef}
                />
                <button className="CTA-button cancel-button" onClick={() => editEmployeeModalRef.current.close()}>
                  Cancel
                </button>
              </dialog>
              <button className="CTA-button" onClick={editInfoModalOpener}>
                Edit info
              </button>
            </>
          )}
          {location.includes("/teams") &&
            activeEmployeeRef?.position === "member" && (
              <>
                <ChangeTeamDialog />
                <button className="CTA-button" onClick={changeTeamDialogOpener}>
                  Move to another team
                </button>
              </>
            )}
        </div>
      </div>
      <p className="error-message" ref={errorRef}></p>
    </>
  );
};

export default EmployeeCard;
