import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getEmployee } from "../../utils/Slices/employeeSlice";
import { setActiveEntity } from "../../utils/Slices/utilitySlice";
import "./Header.scss";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const selectEmployee = useSelector(getEmployee);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  //debounced search
  const search = () => {
    if (searchQuery === "") {
      setSearchResults([]);
      return;
    }
    let results = [];
    selectEmployee.ids.forEach((id) => {
      let employee = selectEmployee.entities[id];
      if (
        employee.name.toLowerCase().includes(searchQuery) ||
        employee.email.toLowerCase().includes(searchQuery) ||
        String(employee.phoneNumber).includes(searchQuery)
      ) {
        results.push(employee);
      }
    });
    setSearchResults(results);
  };

  useEffect(() => {
    let timerID = setTimeout(() => {
      search();
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [searchQuery]);

  useEffect(()=>{
    setSearchQuery("");
    setSearchResults([]);
  },[location])

  const handleStateChange = (employee) => {
    console.log(employee)
    dispatch(setActiveEntity({id:employee.id,type:"employee"}));
    navigate("/");
  };

  return (
    <div
      className="header-container"
    >
      <Link to="/">
        <h1>Employee Management System</h1>
      </Link>
      <form>
        <input
          style={{ width: "400px" }}
          type="text"
          placeholder="Search an employee by Name, email, phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </form>
        <div
        className="search-results"
        >
          {searchResults.map((employee) => {
            return (
              <div key={employee.id} onClick={()=>handleStateChange(employee)}>
                <p>{employee.name}</p>
                <small>{employee.email}</small>&nbsp;
                <small>{employee.phoneNumber}</small>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default Header;
