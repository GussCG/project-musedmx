import { Routes, Route } from "react-router-dom";

import "./styles/App.scss";

import IndexPage from "./pages/IndexPage";
import LoginForm from "./pages/LoginForm";
import SignInForm from "./pages/SignInForm";
import NotFound from "./pages/NotFound";

import AuthLayout from "./layouts/AuthLayout";
import VerMuseosLayout from "./layouts/VerMuseosLayout";
import AuthProvider from "./context/AuthProvider";
import ProfileLayout from "./layouts/ProfileLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* INDEX */}
        <Route path="/" element={<IndexPage />} />

        {/* Autenticación */}
        <Route path="Auth" element={<AuthLayout />}>
          <Route path="Iniciar" element={<LoginForm />} />
          <Route path="Registrarse" element={<SignInForm />} />
        </Route>

        {/* Sección de Museos */}
        <Route path="Museos/*" element={<VerMuseosLayout />} />

        {/* Sección de Perfil de Usuario */}
        <Route path="Perfil/*" element={<ProfileLayout />} />

        {/* Página de Error 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
