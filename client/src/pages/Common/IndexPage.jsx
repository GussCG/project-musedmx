import "../../styles/pages/IndexPage.scss";
import NavBarMenu from "../../components/Other/NavBarMenu";
import Footer from "../../components/Other/Footer";
import { motion } from "framer-motion";
import IndexSlider from "../../components/Other/IndexSlider";

function IndexPage() {
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
