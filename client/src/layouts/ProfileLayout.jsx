import { Outlet } from "react-router-dom";
import "../styles/pages/ProfileLayout.scss";
import "../styles/pages/AuthLayout.scss";
import "../styles/pages/AdmModPage.scss";
import NavBarMenu from "../components/Other/NavBarMenu.jsx";
import Footer from "../components/Other/Footer.jsx";

function ProfileLayout() {
  return (
    <div>
      <NavBarMenu />
      <Outlet />
      <Footer />
    </div>
  );
}

export default ProfileLayout;
