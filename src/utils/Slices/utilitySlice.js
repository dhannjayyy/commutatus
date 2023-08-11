import { createSlice } from "@reduxjs/toolkit";

const initialState = {activeEntity: null, type: null}

const utilitySlice = createSlice({
    name:"utility",
    initialState: initialState,
    reducers:{
        setActiveEntity(state,action){
            state.activeEntity = action.payload.id;
            state.type = action.payload.type;
        }
    }
});

export const getUtilities = (store) => store.utility;
export const {setActiveEntity} = utilitySlice.actions;
export default utilitySlice.reducer;