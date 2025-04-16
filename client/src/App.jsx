import { Routes, Route, Router, useLocation } from "react-router-dom";

import "./styles/App.scss";

import IndexPage from "./pages/Common/IndexPage";
import LoginForm from "./pages/Auth/LoginForm";
import SignInForm from "./pages/Auth/SignInForm";
import NotFound from "./pages/Common/NotFound";
import ScrollToTop from "./components/ScrollToTop.jsx";

import AuthLayout from "./layouts/AuthLayout";
import VerMuseosLayout from "./layouts/VerMuseosLayout";
import AuthProvider from "./context/AuthProvider";
import ProfileLayout from "./layouts/ProfileLayout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { ToastContainer } from "react-toastify";

import ProfileEdit from "./pages/Auth/ProfileEdit";
import ProfileHistory from "./pages/User/ProfileHistory";
import ProfileHistoryDetail from "./pages/User/ProfileHistoryDetail";
import ProfilePage from "./pages/User/ProfilePage";
import ModHistory from "./pages/Mod/ModHistory";
import ModList from "./pages/Mod/ModList.jsx";
import ModForm from "./pages/Mod/ModForm";
import PopUpLogin from "./components/PopUpLogin.jsx";
import RecuperarPass from "./pages/Auth/RecuperarPass";
import { AnimatePresence } from "framer-motion";
import MuseoForm from "./pages/Museo/MuseoForm.jsx";
import MuseoHorariosEdit from "./pages/Museo/MuseoHorariosEdit.jsx";
import MuseoImgEdit from "./pages/Museo/MuseoImgEdit.jsx";
import { ViewModeProvider } from "./context/ViewModeProvider.jsx";

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ViewModeProvider>
        <PopUpLogin />
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
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
            <Route
              path="Usuario/*"
              element={<ProtectedRoute allowedRoles={[1]} />}
            >
              <Route element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="Editar" element={<ProfileEdit />} />
                <Route path="Historial" element={<ProfileHistory />} />
                <Route
                  path="Historial/:id"
                  element={<ProfileHistoryDetail />}
                />
              </Route>
            </Route>

            {/* Para los Adm */}
            <Route
              path="Admin/*"
              element={<ProtectedRoute allowedRoles={[2]} />}
            >
              <Route element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="Editar" element={<ProfileEdit />} />
                <Route path="VerMods" element={<ModList />} />
                <Route path="Agregar" element={<ModForm />} />
                <Route
                  path="VerMods/Editar/:userId"
                  element={<ProfileEdit />}
                />
                <Route
                  path="Museo/Registrar"
                  element={<MuseoForm mode="create" />}
                />
                <Route
                  path="Museo/Editar/:museoId"
                  element={<MuseoForm mode="edit" />}
                />
                <Route
                  path="Museo/EditarHorario/:museoId"
                  element={<MuseoHorariosEdit />}
                />
                <Route
                  path="Museo/EditarImagenes/:museoId"
                  element={<MuseoImgEdit />}
                />
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
        </AnimatePresence>

        <ToastContainer />
      </ViewModeProvider>
    </AuthProvider>
  );
}

export default App;
