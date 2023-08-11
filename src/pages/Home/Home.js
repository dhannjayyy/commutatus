// import logo from './logo.svg';
import { Outlet } from "react-router-dom";
import Header from "../../components/Layout components/Header";
import "./Home.scss";
import DBExtractor from "../../components/Layout components/DBExtractor";

function Home() {
  return (
    <>
      <DBExtractor />
      <Header />
      <Outlet />
    </>
  );
}

export default Home;
