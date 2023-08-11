import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const employeeAdapter = createEntityAdapter({});
const initialState = employeeAdapter.getInitialState({CEO: null});

const employeeSlice = createSlice({
  name: "employee",
  initialState: initialState,
  reducers: {
    addEmployee: employeeAdapter.addOne,
    removeEmployee: employeeAdapter.removeOne,
    updateEmployee : employeeAdapter.updateOne,
    setCEO: (state, action) => {
      state.CEO = action.payload;
    }
  },
});

export const getEmployee = (store)=>store.employee;
export const { addEmployee,removeEmployee,updateEmployee,setCEO } = employeeSlice.actions;
export default employeeSlice.reducer;
