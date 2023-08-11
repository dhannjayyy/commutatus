import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const departmentAdapter = createEntityAdapter({});
const initialState = departmentAdapter.getInitialState();

const departmentSlice = createSlice({
  name: "Department",
  initialState: initialState,
  reducers: {
    addDepartment: departmentAdapter.addOne,
    updateDepartment: departmentAdapter.updateOne,
  },
});

export const getDepartments = (store) => store.department;
export const { addDepartment,updateDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
