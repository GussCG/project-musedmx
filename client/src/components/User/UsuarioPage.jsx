import { useEffect } from "react";
import { motion } from "framer-motion";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import { useMuseosSugeridos } from "../../hooks/Usuario/useUsuarioMuseosSugeridos";
import { useQV } from "../../hooks/QuieroVisitar/useQV";
import NMuseoSlider from "../Museo/NMuseoSlider";

function UsuarioPage() {
  const { user } = useAuth();

  const { museosFavoritos, fetchMuseosFavoritosUsuario } = useFavorito();
  const { museos: museosSugeridosData, refetch: refetchSugeridos } =
    useMuseosSugeridos({
      top_n: 10,
      correo: user?.usr_correo,
    });

  const {
    museos: museosQV,
    loading: loadingQV,
    fetchMuseosQVUsuario,
    agregarQV,
    eliminarQV,
  } = useQV({ correo: user?.usr_correo });

  useEffect(() => {
    if (user?.usr_correo) {
      fetchMuseosFavoritosUsuario(user.usr_correo);
      fetchMuseosQVUsuario(user.usr_correo);
    }
  }, [user]);

  const handleDeleteFromQV = async (museoId) => {
    await eliminarQV(user.usr_correo, museoId);
    fetchMuseosQVUsuario(user.usr_correo);
    refetchSugeridos();
  };

  const handleAddFromQV = async (museoId) => {
    await agregarQV(user.usr_correo, museoId);
    fetchMuseosQVUsuario(user.usr_correo);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.18 }}
    >
      <main id="perfil-main">
        <NMuseoSlider
          museos={museosSugeridosData}
          title="Museos Sugeridos"
          subtitle="Basados en tus visitas y preferencias"
          refetchFavoritos={() => {
            fetchMuseosFavoritosUsuario(user.usr_correo);
          }}
        />
        <hr />
        <NMuseoSlider
          museos={museosFavoritos}
          title="Museos Favoritos"
          refetchFavoritos={() => {
            fetchMuseosFavoritosUsuario(user.usr_correo);
          }}
        />
        <hr />
        <NMuseoSlider
          museos={museosQV || []}
          title="Museos que quiero visitar"
          museosQV={museosQV || []}
          editMode={true}
          correo={user?.usr_correo}
          onDeleteFromQV={handleDeleteFromQV}
          onAddFromQV={handleAddFromQV}
          isLoading={loadingQV}
        />
      </main>
    </motion.div>
  );
}

export default UsuarioPage;
