import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTeams, updateTeam } from "../../utils/Slices/teamSlice";
import { nanoid } from "@reduxjs/toolkit";
import { addEmployee, getEmployee, updateEmployee } from "../../utils/Slices/employeeSlice";
import { updateIndexedDB } from "../../utils/indexedDB";

const EmployeeInfoForm = ({ dialogBox, operation, employeeData }) => {
  const IDtype = useRef();
  const errorRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();
  const selectTeam = useSelector(getTeams);
  const selectEmployee = useSelector(getEmployee);

  const formDataExtractor = (e) => {
    const memberName = e.target.elements.memberName.value.trim();
    const memberEmail = e.target.elements.memberEmail.value.trim();
    const memberPhone = e.target.elements.memberPhone.value.trim();
    const memberID = e.target.elements.memberID.value.trim();
    if (
      memberName === "" ||
      memberEmail === "" ||
      memberPhone === "" ||
      memberID === ""
    ) {
      errorRef.current.textContent = "Please fill all the fields";
      return false;
    } 
    else if(String(memberPhone.length)!=="10"){
      errorRef.current.textContent = "Phone number must be 10 digits long";
      return false;
    }
    else if (selectEmployee.ids.includes(memberID) && memberID !== employeeData?.id) {
      errorRef.current.textContent =
        "Employee with that ID already exists. Use a system generated ID to avoid conflicts.";
      return false;
    }
    return { memberName, memberEmail, memberPhone, memberID };
  }

  const addMember = (e) => {
    e.preventDefault();
    const formData = formDataExtractor(e);
    if(formData === false) return;
    const { memberName, memberEmail, memberPhone, memberID } = formData;

    const employeeObject = {
      name: memberName,
      email: memberEmail,
      phoneNumber: memberPhone,
      id: memberID,
      position: "member"
    }

      dispatch(addEmployee(employeeObject))
      updateIndexedDB("addEmployee",employeeObject)

      const newMembers = [...selectTeam.entities[params.teamID].members, memberID];
      dispatch(
        updateTeam({
            id: params.teamID,
            changes: {
              members: newMembers,
            },
        })
      );
      updateIndexedDB("addMemberToTeam",{teamID: params.teamID, changes:{members: newMembers}})

    e.target.reset();
    dialogBox.current.close();
  };
  
  const updateInfo = (e) => {
    e.preventDefault();
    const formData = formDataExtractor(e);
    if(formData === false) return;
    const { memberName, memberEmail, memberPhone, memberID } = formData;
    dispatch(updateEmployee({
      id: employeeData.id,
      changes: {
        name: memberName,
        email: memberEmail,
        phoneNumber: memberPhone,
        id: memberID,
      }
    }))
    updateIndexedDB("updateEmployee",{employeeID: employeeData.id, changes: {name: memberName, email: memberEmail, phoneNumber: memberPhone, id: memberID}});
    
    e.target.reset();
    dialogBox.current.close();
  }
  
  return (
    <>
      <form
        className="addMemberForm"
        onSubmit={(e)=>`${operation === "add" ? addMember(e) : updateInfo(e)}`}
        style={{ display: "flex", flexDirection: "column", width: "500px" }}
      >
        <label htmlFor="memberName">Name</label>
        <input type="text" name="memberName" id="memberName" required defaultValue={employeeData?.name} 
        onChange={()=>{errorRef.current.textContent=""}}/>
        <label htmlFor="memberEmail">Email</label>
        <input type="email" name="memberEmail" id="memberEmail" required defaultValue={employeeData?.email} 
        onChange={()=>{errorRef.current.textContent=""}}/>
        <label htmlFor="memberPhone">Phone Number</label>
        <input type="tel" name="memberPhone" id="memberPhone" required defaultValue={employeeData?.phoneNumber} 
        onChange={()=>{errorRef.current.textContent=""}}/>
        <label htmlFor="memberID">ID</label>
        <input
          type="text"
          name="memberID"
          id="memberID"
          defaultValue= {`${operation === "add" ? nanoid() : employeeData?.id}`}
          disabled={operation === "update" ? true : false}
          onChange={() => {IDtype.current.style.display = "none"}}
          required
        />
        {operation === "add" && (
          <small className="IDtype" ref={IDtype}>
            (System Generated)
          </small>
        )}
        {operation === "add" ? 
        <button className="CTA-button" type="submit">Add Member</button>:
        <button className="CTA-button" type="submit">Save Changes</button>
      }
      <p ref={errorRef} className="error-message"></p>
      </form>
    </>
  );
};

export default EmployeeInfoForm;
