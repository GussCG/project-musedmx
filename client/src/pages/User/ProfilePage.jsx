import React from "react";
import { useAuth } from "../../context/AuthProvider";

import { motion } from "framer-motion";

import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";

import AdminPage from "../../components/User/AdminPage";
import ModPage from "../../components/User/ModPage";
import UsuarioPage from "../../components/User/UsuarioPage";
import HeaderButtons from "../../components/User/HeaderButtons";

function ProfilePage() {
  const { user } = useAuth();

  const tipoUsuarioLabel = {
    1: "Usuario",
    2: "Administrador",
    3: "Moderador",
  };

  const formatName = (user) => {
    return `${user.usr_nombre} ${user.usr_ap_paterno} ${user.usr_ap_materno}`;
  };

  const formatAge = (user) => {
    const birthdate = new Date(user.usr_fecha_nac);
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
          <img src={user.usr_foto || userPlaceholder} alt="Header" />
        </div>
        <div id="header-user-info">
          <h1>{formatName(user)}</h1>
          <p id="light">{tipoUsuarioLabel[user.usr_tipo]}</p>
          <p id="semibold">{formatAge(user)} años</p>
          {user.usr_tipo === 1 ? <p id="regular">Museos visitados: 3</p> : null}
        </div>
        <HeaderButtons tipoUsuario={user.usr_tipo} />
      </motion.header>

      {user.usr_tipo === 1 && <UsuarioPage />}

      {user.usr_tipo === 2 && <AdminPage />}

      {user.usr_tipo === 3 && <ModPage />}
    </>
  );
}

export default ProfilePage;
