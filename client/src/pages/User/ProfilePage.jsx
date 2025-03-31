import React from "react";
import { useAuth } from "../../context/AuthProvider";

import { motion } from "framer-motion";

import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";

import AdminPage from "../../components/AdminPage";
import ModPage from "../../components/ModPage";
import UsuarioPage from "../../components/UsuarioPage";
import HeaderButtons from "../../components/HeaderButtons";

function ProfilePage() {
  const { user, logout } = useAuth();

  const tipoUsuarioLabel = {
    1: "Usuario",
    2: "Administrador",
    3: "Moderador",
  };

  const formatName = (user) => {
    return `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
  };

  const formatAge = (user) => {
    const birthdate = new Date(user.fecNac);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <>
      <motion.header
        className="profile-header"
        initial={{ y: "-200%" }}
        animate={{ y: "0" }}
        exit={{ y: "-200%" }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.18 }}
      >
        <div id="header-image">
          <img src={user.foto || userPlaceholder} alt="Header" />
        </div>
        <div id="header-user-info">
          <h1>{formatName(user)}</h1>
          <p id="light">{tipoUsuarioLabel[user.tipoUsuario]}</p>
          <p id="semibold">{formatAge(user)} años</p>
          {user.tipoUsuario === 1 ? (
            <p id="regular">Museos visitados: 3</p>
          ) : null}
        </div>
        <HeaderButtons tipoUsuario={user.tipoUsuario} />
      </motion.header>

      {user.tipoUsuario === 1 && <UsuarioPage />}

      {user.tipoUsuario === 2 && <AdminPage />}

      {user.tipoUsuario === 3 && <ModPage />}
    </>
  );
}

export default ProfilePage;
