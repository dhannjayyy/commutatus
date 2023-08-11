import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./Slices/employeeSlice";
import teamReducer from "./Slices/teamSlice";
import departmentReducer from "./Slices/departmentSlice";
import utilityReducer from "./Slices/utilitySlice"

const store = configureStore({
  reducer: {
    employee: employeeReducer,
    team: teamReducer,
    department: departmentReducer,
    utility: utilityReducer,
  },
});

export default store;
