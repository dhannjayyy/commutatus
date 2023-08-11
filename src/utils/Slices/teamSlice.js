import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const teamAdapter = createEntityAdapter({});
const initialState = teamAdapter.getInitialState();

const teamSlice = createSlice({
    name:"Team",
    initialState : initialState,
    reducers:{
        addTeam : teamAdapter.addOne,
        updateTeam : teamAdapter.updateOne,
    }
})

export const getTeams = (store) => store.team;
export const { addTeam, updateTeam } = teamSlice.actions;
export default teamSlice.reducer;