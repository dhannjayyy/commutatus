/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import {
  addEmployee,
  getEmployee,
  setCEO,
} from "../../utils/Slices/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { addTeam, getTeams } from "../../utils/Slices/teamSlice";
import {
  addDepartment,
  getDepartments,
} from "../../utils/Slices/departmentSlice";
import DEPARTMENT_MOCK from "../../utils/Mock Data/departmentMock.json";
import TEAMS_MOCK from "../../utils/Mock Data/teamsMock.json";
import EMPLOYEE_MOCK from "../../utils/Mock Data/employeeMock.json";
import { getUtilities, setActiveEntity } from "../../utils/Slices/utilitySlice";
import { useParams } from "react-router-dom";

const DBExtractor = () => {
  const selectDepartment = useSelector(getDepartments);
  const selectTeam = useSelector(getTeams);
  const selectEmployee = useSelector(getEmployee);
  const selectUtilities = useSelector(getUtilities);
  const dispatch = useDispatch();
  const params = useParams();

  const teamEntitySelector = selectTeam.entities;
  const teamIdsSelector = selectTeam.ids;
  const departmentEntitySelector = selectDepartment.entities;
  const departmentIdsSelector = selectDepartment.ids;
  const employeeEntitiesSelector = selectEmployee.entities;
  const employeeDBexists = useRef(false);

  const createIndexedDB = () => {
    const request = indexedDB.open("employeeDB");
    let db;

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore("employees", {
        keyPath: "id",
      });
      db.createObjectStore("departments", {
        keyPath: "id",
      });
      db.createObjectStore("teams", {
        keyPath: "id",
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      const employeeObjectStore = db
        .transaction("employees", "readwrite")
        .objectStore("employees");
      const departmentObjectStore = db
        .transaction("departments", "readwrite")
        .objectStore("departments");
      const teamObjectStore = db
        .transaction("teams", "readwrite")
        .objectStore("teams");

      //pushing data to indexedDB teamObjectStore
      const teamCountRequest = teamObjectStore.count();
      teamCountRequest.onsuccess = () => {
        if (teamCountRequest.result === 0) {
          teamIdsSelector.forEach((teamId) => {
            const team = teamEntitySelector[teamId];
            teamObjectStore.add(team);
          });
        }
      };

      //pushing data to indexedDB departmentObjectStore
      const departmentCountRequest = departmentObjectStore.count();
      departmentCountRequest.onsuccess = () => {
        if (departmentCountRequest.result === 0) {
          departmentIdsSelector.forEach((departmentId) => {
            const department = departmentEntitySelector[departmentId];
            departmentObjectStore.add(department);
          });
        }
      };

      //pushing data to indexedDB employeeObjectStore
      const employeeCountRequest = employeeObjectStore.count();
      employeeCountRequest.onsuccess = () => {
        if (employeeCountRequest.result === 0) {
          selectEmployee.ids.forEach((employeeId) => {
            const employee = employeeEntitiesSelector[employeeId];
            employeeObjectStore.add(employee);
          });
        }
      };
    };

    request.onerror = (event) => {
      console.log(event.target.errorCode);
    };
  };

  const stateExtractor = () => {
    const request = indexedDB.open("employeeDB");
    let db;

    request.onsuccess = (event) => {
      db = event.target.result;
      const employeeObjectStore = db
        .transaction("employees", "readwrite")
        .objectStore("employees");
      const departmentObjectStore = db
        .transaction("departments", "readwrite")
        .objectStore("departments");
      const teamObjectStore = db
        .transaction("teams", "readwrite")
        .objectStore("teams");

      //extracting data from indexedDB teamObjectStore
      teamObjectStore.getAll().onsuccess = (event) => {
        event.target.result.forEach((team) => {
          dispatch(
            addTeam({
              ...team,
            })
          );
        });
      };

      //extracting data from indexedDB departmentObjectStore
      departmentObjectStore.getAll().onsuccess = (event) => {
        event.target.result.forEach((department) => {
          dispatch(
            addDepartment({
              ...department,
            })
          );
        });
      };

      //extracting data from indexedDB employeeObjectStore
      employeeObjectStore.getAll().onsuccess = (event) => {
        event.target.result.forEach((employee) => {
          employee.position === "CEO" && dispatch(setCEO(employee.id));
          dispatch(
            addEmployee({
              ...employee,
            })
          );
        });
      };
    };

    request.onerror = (event) => {
      console.log(event.target.errorCode);
    };
  };

  const mockTeamsGenerator = () => {
    TEAMS_MOCK.forEach((team) => {
      dispatch(
        addTeam({
          ...team,
        })
      );
    });
  };

  const mockDepartmentGenerator = () => {
    DEPARTMENT_MOCK.forEach((department) => {
      dispatch(
        addDepartment({
          ...department,
        })
      );
    });
  };

  const mockEmployeeGenerator = () => {
    EMPLOYEE_MOCK.forEach((employee) => {
      if (employee.position === "CEO") dispatch(setCEO(employee.id));
      dispatch(
        addEmployee({
          ...employee,
        })
      );
    });
  };

  useEffect(() => {
    (async () => {
      if (!employeeDBexists.current) {
        const databasePromise = indexedDB.databases();
        const databases = await databasePromise;
        databases.forEach((db) => {
          if (db.name === "employeeDB") {
            employeeDBexists.current = true;
          }
        });
      }

      // Add mock data to store if IndexedDB is not present
      if (!employeeDBexists.current) {
        //CREATING TEAMS FIRST
        mockTeamsGenerator();

        //CREATING DEPARTMENTS
        mockDepartmentGenerator();

        //CREATING EMPLOYEES
        mockEmployeeGenerator();
      } else {
        if (params.teamID && selectUtilities.activeEntity !== params.teamID) {
          dispatch(setActiveEntity({ id: params.teamID, type: "team" }));
        }
        stateExtractor();
      }

    })();
  }, []);
  if (!employeeDBexists.current) {
    createIndexedDB();
  }

  //   return <div>DBExtractor</div>;
};

export default DBExtractor;
