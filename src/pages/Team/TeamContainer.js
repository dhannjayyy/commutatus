import React from "react";
import TeamCard from "../../components/Teams/TeamCard";
import { getUtilities } from "../../utils/Slices/utilitySlice";
import { useSelector } from "react-redux";

const TeamContainer = () => {
  const selectUtilities = useSelector(getUtilities);

  return (
    <>
        <TeamCard
          teamID={selectUtilities.activeEntity}
          showEditButton={false}
        />
    </>
  );
};

export default TeamContainer;
