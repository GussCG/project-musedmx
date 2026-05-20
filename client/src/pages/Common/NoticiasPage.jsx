import { useState } from "react";
import NavBarMenu from "../../components/Other/NavBarMenu";
import Footer from "../../components/Other/Footer";
import NoticiasHero from "../../components/Noticias/NoticiasHero";
import "../../styles/pages/NoticiasPage.scss";
import UltimasNoticias from "../../components/Noticias/UltimasNoticias";
import { useNoticias } from "../../hooks/Noticias/useNoticias";
import { motion } from "framer-motion";

function NoticiasPage() {
  const { noticias, loading } = useNoticias();
  const noticiaDestacada = noticias[0];

  // Filtro
  const [filter, setFilter] = useState("todas");
  const [currentPage, setCurrentPage] = useState(0);

  const noticiasFiltradas = noticias.filter((noticia) => {
    if (filter === "museos") return noticia.mus_id !== null;
    return true;
  });

  const restoNoticias = noticiasFiltradas.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavBarMenu />

      <div className="noticias-container">
        <NoticiasHero noticia={noticiaDestacada} />
        <UltimasNoticias
          noticias={restoNoticias}
          currentFilter={filter}
          onFilterChange={(newFilter) => {
            setFilter(newFilter);
            setCurrentPage(0);
          }}
          currentPage={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          loading={loading}
        />
      </div>

      <Footer />
    </motion.div>
  );
}

export default NoticiasPage;
