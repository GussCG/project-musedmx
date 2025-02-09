import React from "react";
import { Routes, Route } from "react-router-dom";

import ProfileEdit from "../pages/ProfileEdit";
import ProfileHistory from "../pages/ProfileHistory.jsx";
import ProfileHistoryDetail from "../pages/ProfileHistoryDetail";
import ProfilePage from "../pages/ProfilePage";

function ProfileLayout() {
  return <div>ProfileLayout</div>;
}

function ProfileRoutes() {
  return (
    <Routes>
      <Route element={<ProfileLayout />} />
      <Route index element={<ProfilePage />} />
      <Route path="/Editar" element={<ProfileEdit />} />
      <Route path="/Historial" element={<ProfileHistory />} />
      <Route path="/Historial/:id" element={<ProfileHistoryDetail />} />
    </Routes>
  );
}

export { ProfileLayout };
export default ProfileRoutes;
