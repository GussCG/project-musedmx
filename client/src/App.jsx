import { Routes, Route, Router } from "react-router-dom";

import "./styles/App.scss";

import IndexPage from "./pages/IndexPage";
import LoginForm from "./pages/LoginForm";
import SignInForm from "./pages/SignInForm";
import NotFound from "./pages/NotFound";

import AuthLayout from "./layouts/AuthLayout";
import VerMuseosLayout from "./layouts/VerMuseosLayout";
import AuthProvider from "./context/AuthProvider";
import ProfileLayout from "./layouts/ProfileLayout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { ToastContainer } from "react-toastify";

import ProfileEdit from "./pages/ProfileEdit";
import ProfileHistory from "./pages/ProfileHistory.jsx";
import ProfileHistoryDetail from "./pages/ProfileHistoryDetail";
import ProfilePage from "./pages/ProfilePage";
import ModHistory from "./pages/ModHistory";
import ModList from "./pages/ModList.jsx";
import ModForm from "./pages/ModForm";
import PopUpLogin from "./components/PopUpLogin.jsx";
import RecuperarPass from "./pages/RecuperarPass.jsx";

function App() {
  return (
    <AuthProvider>
      <PopUpLogin />
      <Routes>
        {/* INDEX */}
        <Route path="/" element={<IndexPage />} />

        {/* Autenticación */}
        <Route path="Auth" element={<AuthLayout />}>
          <Route path="Iniciar" element={<LoginForm />} />
          <Route path="Registrarse" element={<SignInForm />} />
          <Route path="Recuperar" element={<RecuperarPass />} />
        </Route>

        {/* Sección de Museos */}
        <Route path="Museos/*" element={<VerMuseosLayout />} />

        {/* Usuario Normal */}
        <Route path="Usuario/*" element={<ProtectedRoute allowedRoles={[1]} />}>
          <Route element={<ProfileLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="Editar" element={<ProfileEdit />} />
            <Route path="Historial" element={<ProfileHistory />} />
            <Route path="Historial/:id" element={<ProfileHistoryDetail />} />
          </Route>
        </Route>

        {/* Para los Adm */}
        <Route path="Admin/*" element={<ProtectedRoute allowedRoles={[2]} />}>
          <Route element={<ProfileLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="Editar" element={<ProfileEdit />} />
            <Route path="VerMods" element={<ModList />} />
            <Route path="Agregar" element={<ModForm />} />
            <Route path="VerMods/Editar/:userId" element={<ProfileEdit />} />
          </Route>
        </Route>

        {/* Para los Mod */}
        <Route path="Mod/*" element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route element={<ProfileLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="Editar" element={<ProfileEdit />} />
            <Route path="VerResenas" element={<ModHistory />} />
            <Route path="VerResenas/:museoId" element={<ModHistory />} />
          </Route>
        </Route>

        {/* Página de Error 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
