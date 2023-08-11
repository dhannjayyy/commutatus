import React from "react";
import dropdownIcon from "../../assets/icons/caret-down-solid.svg";
import { useDispatch } from "react-redux";
import { setActiveEntity } from "../../utils/Slices/utilitySlice";

const DropdownHeading = ({ heading, customClass, entityID }) => {
  const dispatch = useDispatch();

  const dropdownHandler = (e) => {
    let dropdownPeformer;
    if (e.target.tagName === "BUTTON")
      dropdownPeformer = e.target.parentElement;
    else if (e.target.tagName === "IMG")
      dropdownPeformer = e.target.parentElement.parentElement;
    dropdownPeformer?.classList.toggle("dropdown-button-active");
    dropdownPeformer?.nextElementSibling.classList.toggle("dropdown-closed");
  };

  const selectionHandler = (e, entityID) => {
    let target = e.target;
    let targetClasses = target.classList;
    if (
      targetClasses.contains("ceo") ||
      targetClasses.contains("outermost-dropdown") ||
      targetClasses.contains("department-head") ||
      targetClasses.contains("department-dropdown")
    ) {
      dispatch(setActiveEntity({ id: entityID, type: "employee" }));
    } else if (
      targetClasses.contains("team-name") ||
      targetClasses.contains("team-dropdown")
    ) {
      dispatch(setActiveEntity({ id: entityID, type: "team" }));
    }
  };

  return (
    <div
      className={`dropbutton-heading ${customClass[0]}`}
      onClick={(e) => {
        selectionHandler(e, entityID);
      }}
    >
      <button onClick={dropdownHandler}>
        <img
          src={dropdownIcon}
          alt="dropdown-icon"
          style={{ transform: "rotate(90deg)" }}
        />
      </button>
      <p className={`${customClass[1]}`}>{heading}</p>
    </div>
  );
};

export default DropdownHeading;
