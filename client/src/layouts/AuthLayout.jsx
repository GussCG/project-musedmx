import { Outlet } from "react-router";
import NavBarMenu from "../components/Other/NavBarMenu";
import Footer from "../components/Other/Footer";
import "../styles/pages/AuthLayout.scss";

<script src="https://animatedicons.co/scripts/embed-animated-icons.js"></script>;

function AuthLayout() {
  return (
    <div>
      <NavBarMenu />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AuthLayout;
