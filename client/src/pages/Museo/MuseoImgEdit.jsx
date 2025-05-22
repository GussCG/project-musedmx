import { useEffect, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;
import { useParams, useNavigate } from "react-router-dom";
import useMuseoGaleria from "../../hooks/Museo/useMuseoGaleria";

function MuseoImgEdit() {
  // Para las imagenes del museo
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const navigate = useNavigate();

  const { museoId } = useParams();

  const { galeria, loading, error, uploadImages, updateGaleria } =
    useMuseoGaleria(museoId);

  console.log("galeria", galeria);

  // Función para abrir el input de file
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Función para subir las imagenes desde arrastrar y soltar
  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const totalFiles = uploadedFiles.length + validFiles.length;

    if (totalFiles > 20) {
      console.error("Máximo 20 fotos");
      return;
    }

    droppedFiles.forEach((file) => {
      handleFileUpload(file);
    });
  };

  // Funcion para subir las imagenes
  const handleFileChange = (e) => {
    const file = Array.from(e.target.files);
    const validFiles = file.filter((file) => file.type.startsWith("image/"));
    const totalFiles = uploadedFiles.length + validFiles.length;

    if (totalFiles > 20) {
      toast.error(`Máximo 20 fotos`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    validFiles.forEach((file) => {
      handleFileUpload(file);
    });

    e.target.value = null; // Limpiar el input después de seleccionar los archivos
  };

  // Funcion para eliminar las imagenes
  const handleFileDelete = (name) => {
    // Limpiar url del objeto para liberar memoria
    const fileToDelete = uploadedFiles.find((file) => file.name === name);
    if (fileToDelete) {
      URL.revokeObjectURL(fileToDelete.url); // Revocar la URL del objeto
    }
    const newFiles = uploadedFiles.filter((file) => file.name !== name);
    setUploadedFiles(newFiles);
  };

  // Función para el tamaño de la imagen
  const formatBytes = (bytes) => {
    if (bytes === 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = (file) => {
    // Crear una URL de objeto para la imagen
    const imageUrl = URL.createObjectURL(file);

    setProgress((prevProgress) => [
      ...prevProgress,
      { name: file.name, percent: 0, id: Date.now() },
    ]);

    // Simular la subida de la imagen (puedes reemplazar esto con tu lógica real de subida)
    let uploadPercent = 0;
    const interval = setInterval(() => {
      uploadPercent += 10;
      setProgress((prevProgress) =>
        prevProgress.map((p) =>
          p.name === file.name ? { ...p, percent: uploadPercent } : p
        )
      );

      if (uploadPercent >= 100) {
        clearInterval(interval);

        const newFile = {
          id: Date.now(),
          name: file.name,
          size: formatBytes(file.size),
          url: imageUrl,
          fileObject: file,
        };

        setUploadedFiles((prev) => [...prev, newFile]);

        // Limpiar el progreso de este archivo específico después de un breve retraso
        setProgress((prev) => prev.filter((p) => p.name !== file.name));

        // Aqui puedes hacer la llamada a la API para guardar la imagen en el servidor
      }
    }, 500);
  };

  const handleSave = async () => {
    const nuevasImagenes = uploadedFiles.filter(
      (f) => !f.url.startsWith("http")
    );
    const imagenesExistentes = uploadedFiles.filter((f) =>
      f.url.startsWith("http")
    );

    const formData = new FormData();
    nuevasImagenes.forEach((file) => {
      formData.append("galeria", file.fileObject);
    });

    try {
      const nuevasUrls = await uploadImages(formData);

      const galeriaFinal = [
        ...imagenesExistentes.map((f) => f.url),
        ...nuevasUrls,
      ];

      const response = await updateGaleria(museoId, galeriaFinal);
      if (response.success) {
        navigate(`/Museo/${museoId}`);
      }
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
    }
  };

  useEffect(() => {
    if (galeria && Array.isArray(galeria)) {
      const newFiles = galeria.map((file) => ({
        id: file.gal_foto_id,
        name: file.gal_foto,
        size: "",
        url: file.gal_foto,
        fileObject: null, // No tenemos el objeto de archivo original aquí
      }));
      setUploadedFiles(newFiles);
    }
  }, [galeria]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
      key={"museo-img-edit"}
    >
      <main id="editar-fotos-museo-main">
        <h1>Editar las imágenes del museo</h1>
        <motion.div
          className="dnd-container"
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          key={"museo-img-edit-container"}
          transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
        >
          <div className="registros-field-fotos">
            <div
              id="registros-fotos-container"
              onClick={handleFileClick}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                name="regresfrmfotos"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                hidden
              />
              <LuImageUp />
              <label>
                Sube aquí tus fotos
                <br />
                (Haz clic o arrastra la imagen)
              </label>
            </div>
            {progress.length > 0 && (
              <motion.section className="progress-area">
                {progress.map((prog, idx) => (
                  <li className="row" key={idx}>
                    <FaImage />
                    <div className="content">
                      <div className="details">
                        <span className="name">{prog.name} • Subiendo</span>
                        <span className="percent-image">{prog.percent} %</span>
                      </div>
                      <div className="progress-bar-image">
                        <div
                          className="progress-image"
                          style={{
                            width: `${prog.percent}%`,
                            transition: "width 0.3s",
                          }}
                        ></div>
                      </div>
                    </div>
                  </li>
                ))}
              </motion.section>
            )}
            <section className="uploaded-area">
              {uploadedFiles.map((file, index) => (
                <li className="row" key={index}>
                  <div className="content">
                    <div className="image-file">
                      <img src={file.url} alt={file.name} />
                    </div>

                    <div className="details">
                      <span className="name">{file.name} • Subida</span>
                      <span className="size">{file.size}</span>
                    </div>
                  </div>
                  <div className="icons-file">
                    <IoIosCheckmarkCircle />
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleFileDelete(file.name)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </section>
          </div>
          <button className="button" id="registros-button" type="submit">
            Guardar Cambios
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
}

export default MuseoImgEdit;
