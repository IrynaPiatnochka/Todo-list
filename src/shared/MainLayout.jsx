import { Outlet } from "react-router-dom";
import Header from "./Header";  

function MainLayout({ title }) {
  return (
    <>
      <Header title={title} />
      <Outlet /> 
    </>
  );
}

export default MainLayout;