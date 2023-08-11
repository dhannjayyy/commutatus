export const updateIndexedDB = (type, data) => {
  let db;
  const request = indexedDB.open("employeeDB");
  request.onsuccess = (e) => {
    db = e.target.result;
    const employeeTransaction = db.transaction("employees", "readwrite");
    const employeeObjectStore = employeeTransaction.objectStore("employees");

    const teamsTransaction = db.transaction("teams", "readwrite");
    const teamsObjectStore = teamsTransaction.objectStore("teams");

    const departmentsTransaction = db.transaction("departments", "readwrite");
    const departmentsObjectStore =
      departmentsTransaction.objectStore("departments");

    switch (type) {
      case "addEmployee":
        employeeObjectStore.add(data);
        break;
      case "addMemberToTeam":
        teamsObjectStore.get(data.teamID).onsuccess = (e) => {
          const team = e.target.result;
          team.members = data.changes.members;
          teamsObjectStore.put(team);
        };
        break;
      case "updateEmployee":
        employeeObjectStore.get(data.employeeID).onsuccess = (e) => {
          const employee = e.target.result;
          employee.name = data.changes.name;
          employee.email = data.changes.email;
          employee.phoneNumber = data.changes.phoneNumber;
          employee.id = data.changes.id;
          employeeObjectStore.put(employee);
        };
        break;
      case "addTeam":
        teamsObjectStore.add(data);
        break;
      case "addTeamToDepartment":
        departmentsObjectStore.get(data.departmentID).onsuccess = (e) => {
          const department = e.target.result;
          department.teams = data.changes.teams;
          departmentsObjectStore.put(department);
        };
        break;
      case "changeTeamName":
        teamsObjectStore.get(data.id).onsuccess = (e) => {
          const team = e.target.result;
          team.name = data.changes.name;
          teamsObjectStore.put(team);
        };

        break;
      case "removeEmployee":
        employeeObjectStore.delete(data);
        break;
      case "removeMemberFromTeam":
        teamsObjectStore.get(data.teamID).onsuccess = (e) => {
          const team = e.target.result;
          team.members = data.changes.members;
          teamsObjectStore.put(team);
        };
        break;
    
      default:
        break;
    }
  };
};
