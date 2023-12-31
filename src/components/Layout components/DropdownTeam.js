import React from "react";
import DropdownHeading from "./DropdownHeading";
import { getTeams } from "../../utils/Slices/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee } from "../../utils/Slices/employeeSlice";
import { getUtilities, setActiveEntity } from "../../utils/Slices/utilitySlice";

const DropdownTeam = ({ departmentTeams }) => {
  const selectTeam = useSelector(getTeams);
  const selectEmployee = useSelector(getEmployee);
  const selectUtilities = useSelector(getUtilities)
  const dispatch = useDispatch();

  const selectionHandler = (e, entityID) => {
    console.log(e.target)
    let target = e.target;
    let targetClasses = target.classList;
    if (
      targetClasses.contains("sidebar-team-leader") ||
      targetClasses.contains("sidebar-team-member")
    ) {
      dispatch(setActiveEntity({ id: entityID, type: "employee" }));
    }
  };

  console.log(selectUtilities)

  return (
    <div className={`team-dropdown-container dropdown-margin-left`}>
      {departmentTeams.map((teamID) => {
        return (
          <div className="team-wrapper" key={teamID}>
            <DropdownHeading
              entityID={teamID}
              heading={selectTeam.entities[teamID]?.name}
              customClass={["team-dropdown", "team-name"]}
            />
            <div className={`team-employees dropdown-margin-left`}>
              <p
                className="sidebar-team-leader"
                onClick={(e) => {
                  selectionHandler(e, selectTeam.entities[teamID]?.leader);
                }}
              >
                {
                  selectEmployee.entities[selectTeam.entities[teamID]?.leader]?.name
                }
              </p>
              {selectTeam.entities[teamID]?.members.map((memberID) => {
                return (
                  <p
                    className="sidebar-team-member"
                    key={memberID}
                    onClick={(e) => {
                      selectionHandler(e, memberID);
                    }}
                  >
                    {selectEmployee.entities[memberID]?.name}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownTeam;
