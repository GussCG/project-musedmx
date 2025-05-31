import { useEffect, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;
import { useParams, useNavigate } from "react-router-dom";
import useMuseoGaleria from "../../hooks/Museo/useMuseoGaleria";
import ScrollIndicator from "../../components/Other/ScrollIndicator";
import ToastMessage from "../../components/Other/ToastMessage";
import ImageUploader from "../../components/Other/ImageUploader";

function MuseoImgEdit() {
  const { museoId } = useParams();
  const navigate = useNavigate();
  const { galeria, uploadImagesGaleria, eliminarImagenGaleria } =
    useMuseoGaleria(museoId);

  const initialImages = galeria.map((img) => ({
    id: img.gal_foto_id,
    name: img.gal_foto_,
    size: "",
    url: img.gal_foto,
  }));

  const [imagenesSubidas, setImagenesSubidas] = useState([]);

  const handleGuardarCambios = async () => {
    const nuevosArchivos = imagenesSubidas
      .filter((f) => f.fileObject instanceof File)
      .map((f) => f.fileObject);

    if (nuevosArchivos.length === 0) {
      ToastMessage({ tipo: "error", mensaje: "No hay imágenes nuevas" });
      return;
    }

    const formData = new FormData();
    nuevosArchivos.forEach((f) => formData.append("fotos", f));

    const res = await uploadImagesGaleria(museoId, formData);
    if (res?.success) {
      ToastMessage({ tipo: "success", mensaje: "Imágenes guardadas" });
      navigate(`/Museos/${museoId}`);
    } else {
      ToastMessage({ tipo: "error", mensaje: "Error al subir" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
      key={"museo-img-edit"}
    >
      <main id="museo-img-edit">
        <h1>Editar imágenes del museo</h1>
        <ImageUploader
          initialImages={initialImages}
          onUpload={(formData) => uploadImagesGaleria(museoId, formData)}
          onDelete={(galFotoId) => eliminarImagenGaleria(museoId, galFotoId)}
          maxFiles={20}
          redirectTo={`/Museos/${museoId}`}
          navigate={navigate}
          setFieldValue={(name, value) => {
            // Use setTimeout to defer the state update
            setTimeout(() => {
              if (name === "imagenes") {
                setImagenesSubidas(value);
              }
            }, 0);
          }}
          name="imagenes"
        />
        <button className="button" onClick={handleGuardarCambios}>
          Guardar Cambios
        </button>
      </main>
    </motion.div>
  );
}

export default MuseoImgEdit;
