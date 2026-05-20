import NavBarMenu from "../../components/Other/NavBarMenu";
import Footer from "../../components/Other/Footer";
import ComunidadHero from "../../components/Comunidad/ComunidadHero";

import "../../styles/pages/ComunidadPage.scss";
import ResenasRecientes from "../../components/Comunidad/ResenasRecientes";
import ComunidadUnirse from "../../components/Comunidad/ComunidadUnirse";
import { motion } from "framer-motion";

function ComunidadPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavBarMenu />
      <div className="comunidad-container">
        <ComunidadHero />
        <ResenasRecientes />
        <ComunidadUnirse />
      </div>
      <Footer />
    </motion.div>
  );
}

export default ComunidadPage;
