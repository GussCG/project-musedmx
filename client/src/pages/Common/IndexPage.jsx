import "../../styles/pages/IndexPage.scss";
import NavBarMenu from "../../components/NavBarMenu";
import Footer from "../../components/Footer";

import { useAuth } from "../../context/AuthProvider";

import { motion } from "framer-motion";
import IndexSlider from "../../components/IndexSlider";

function IndexPage() {
  const { user, tipoUsuario } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavBarMenu />
      <main id="index-main">
        <IndexSlider />
      </main>
      <Footer />
    </motion.div>
  );
}

export default IndexPage;
