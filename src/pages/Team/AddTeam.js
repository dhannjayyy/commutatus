import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { addEmployee } from "../../utils/Slices/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { addTeam, getTeams } from "../../utils/Slices/teamSlice";
import {
  getDepartments,
  updateDepartment,
} from "../../utils/Slices/departmentSlice";
import { updateIndexedDB } from "../../utils/indexedDB";
import "./AddTeam.scss"

const AddTeam = () => {
  const location = useParams();
  const selectTeam = useSelector(getTeams);
  const selectDepartment = useSelector(getDepartments);
  const teamsRefIds = selectTeam.ids;
  const teamsRefEntities = selectTeam.entities;
  const departmentRefEntities = selectDepartment.entities;
  const leaderIDtype = useRef();
  const memberIDtype = useRef();
  const errorRef = useRef();
  const successMsgRef = useRef();
  const dispatch = useDispatch();

  const exisitingTeamChecker = (teamName) => {
    let flag = false;
    teamsRefIds.forEach((teamID) => {
      if (teamsRefEntities[teamID].name === teamName) {
        flag = true;
      }
    });
    return flag;
  };

  const clearErrorMessage = () => {
    errorRef.current.textContent = "";
  };

  const formInputValidator = (e) => {
    const elements = e.target.elements;
    const leaderName = elements.leaderName.value.trim();
    const leaderEmail = elements.leaderEmail.value.trim();
    const leaderPhone = elements.leaderPhone.value.trim();
    const leaderID = elements.leaderID.value.trim();
    const memberName = elements.memberName.value.trim();
    const memberEmail = elements.memberEmail.value.trim();
    const memberPhone = elements.memberPhone.value.trim();
    const memberID = elements.memberID.value.trim();
    const teamName = elements.teamName.value.trim();

    if (
      teamName === "" ||
      leaderEmail === "" ||
      leaderID === "" ||
      leaderName === "" ||
      leaderPhone === "" ||
      memberEmail === "" ||
      memberID === "" ||
      memberName === "" ||
      memberPhone === ""
    ) {
      errorRef.current.textContent = "Please fill all the fields";
      return false;
    } else if (leaderEmail === memberEmail) {
      errorRef.current.textContent =
        "Team leader and team member cannot have same email";
      return false;
    } else if (leaderPhone === memberPhone) {
      errorRef.current.textContent =
        "Team leader and team member cannot have same phone number";
      return false;
    } else if (leaderID === memberID) {
      errorRef.current.textContent =
        "Team leader and team member cannot have same ID";
      return false;
    } else if (exisitingTeamChecker(teamName)) {
      errorRef.current.textContent = "Team with that name already exists";
      return false;
    } else if (leaderPhone.length !== 10 || memberPhone.length !== 10) {
      errorRef.current.textContent = "Phone number should be 10 digits";
      return false;
    } else {
      return {
        leaderEmail,
        leaderID,
        leaderName,
        leaderPhone,
        memberEmail,
        memberID,
        memberName,
        memberPhone,
        teamName,
      };
    }
  };

  const createTeamHandler = (e) => {
    e.preventDefault();
    const formDataValid = formInputValidator(e);
    if (formDataValid === false) return;
    errorRef.current.textContent = "";
    const {
      leaderEmail,
      leaderID,
      leaderName,
      leaderPhone,
      memberEmail,
      memberID,
      memberName,
      memberPhone,
      teamName,
    } = formDataValid;
    const newTeamId = nanoid();
    try {
      const teamObject = {
        id: newTeamId,
        name: teamName,
        leader: leaderID,
        members: [memberID],
      };

      const employeeLeaderObject = {
        id: leaderID,
        name: leaderName,
        email: leaderEmail,
        phoneNumber: leaderPhone,
        position: "leader",
      };

      const employeeMemberObject = {
        id: memberID,
        name: memberName,
        email: memberEmail,
        phoneNumber: memberPhone,
        position: "member",
      };
      dispatch(addTeam(teamObject));
      updateIndexedDB("addTeam", teamObject);

      dispatch(addEmployee(employeeLeaderObject));
      updateIndexedDB("addEmployee", employeeLeaderObject);

      dispatch(addEmployee(employeeMemberObject));
      updateIndexedDB("addEmployee", employeeMemberObject);

      const exisitingTeams = [
        ...departmentRefEntities[location.departmentID]?.teams,
      ];
      if (!exisitingTeams.includes(newTeamId)) {
        exisitingTeams.push(newTeamId);
        dispatch(
          updateDepartment({
            id: location.departmentID,
            changes: {
              teams: [...exisitingTeams],
            },
          })
        );
        updateIndexedDB("addTeamToDepartment", {
          departmentID: location.departmentID,
          changes: {
            teams: [...exisitingTeams],
          }
        });
      }
      e.target.reset();
      successMsgRef.current.textContent = "Team created successfully";
    } catch (error) {
      errorRef.current.textContent = "Something went wrong, try again";
    }
  };

  return (
    <div className="addteam-container">
      <h1>Add Team</h1>
      <form onSubmit={createTeamHandler}>
        <label htmlFor="teamName">Team name : </label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          onChange={clearErrorMessage}
        />
        <p>Team Leader : </p>
        <label htmlFor="leaderName">Name</label>
        <input
          type="text"
          name="leaderName"
          id="leaderName"
          onChange={clearErrorMessage}
        />
        <label htmlFor="leaderEmail">Email</label>
        <input
          type="email"
          name="leaderEmail"
          id="leaderEmail"
          onChange={clearErrorMessage}
        />
        <label htmlFor="leaderPhone">Phone Number</label>
        <input
          type="tel"
          name="leaderPhone"
          id="leaderPhone"
          onChange={clearErrorMessage}
        />
        <label htmlFor="leaderID">ID</label>
        <input
          type="text"
          name="leaderID"
          id="leaderID"
          onChange={() => {
            clearErrorMessage();
            leaderIDtype.current.textContent = "";
          }}
          defaultValue={nanoid()}
        />
        <small className="IDtype" ref={leaderIDtype}>
          (System Generated)
        </small>
        <p>Team Member : </p>
        <label htmlFor="memberName">Name</label>
        <input
          type="text"
          name="memberName"
          id="memberName"
          onChange={clearErrorMessage}
        />
        <label htmlFor="memberEmail">Email</label>
        <input
          type="email"
          name="memberEmail"
          id="memberEmail"
          onChange={clearErrorMessage}
        />
        <label htmlFor="memberPhone">Phone Number</label>
        <input
          type="tel"
          name="memberPhone"
          id="memberPhone"
          onChange={clearErrorMessage}
        />
        <label htmlFor="memberID">ID</label>
        <input
          type="text"
          name="memberID"
          id="memberID"
          onChange={() => {
            clearErrorMessage();
            memberIDtype.current.textContent = "";
          }}
          defaultValue={nanoid()}
        />
        <small className="IDtype" ref={memberIDtype}>
          (System Generated)
        </small>
        <button className="create-team-button CTA-button" type="submit">Create team</button>
      </form>
      <p ref={errorRef}></p>
      <p ref={successMsgRef}></p>
    </div>
  );
};

export default AddTeam;
