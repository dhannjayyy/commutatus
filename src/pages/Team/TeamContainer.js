import React from "react";
import TeamCard from "../../components/Teams/TeamCard";
import { useParams } from "react-router-dom";

const TeamContainer = () => {
  const teamID = useParams().teamID;

  return (
    <>
        <TeamCard
          teamID={teamID}
          showEditButton={false}
        />
    </>
  );
};

export default TeamContainer;
