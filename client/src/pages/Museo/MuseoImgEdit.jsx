import { useEffect, useRef, useState } from "react";

import { Bounce, toast } from "react-toastify";

import { AnimatePresence, motion } from "framer-motion";

import Icons from "../../components/IconProvider";
const { FaStar, FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;

function MuseoImgEdit() {
  // Para las imagenes del museo
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Cuando este el backend
  // useEffect(() => {
  //   // Simulación de obtención de imágenes desde la API
  //   const fetchImages = async () => {
  //     try {
  //       // Aquí iría tu llamada real a la API
  //       const response = await fetch("tu_endpoint_api");
  //       const imagesFromDB = await response.json();

  //       // Convertir los BLOBs a URLs de datos
  //       const formattedImages = imagesFromDB.map((image) => ({
  //         id: image.id,
  //         name: image.nombre_archivo || `imagen_${image.id}`,
  //         size: formatBytes(image.tamanio || 0),
  //         url: `data:${image.tipo_mime};base64,${arrayBufferToBase64(
  //           image.datos_imagen
  //         )}`,
  //       }));

  //       setUploadedFiles(formattedImages);
  //     } catch (error) {
  //       console.error("Error al cargar imágenes:", error);
  //     }
  //   };
  //   fetchImages();
  // }, []);

  // // Función para convertir ArrayBuffer a Base64
  // const arrayBufferToBase64 = (buffer) => {
  //   if (!buffer) return '';
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // };

  // Para pruebas, despues aqui se llama a la API para obtener las imagenes del museo
  useEffect(() => {
    // Simular la carga de imágenes existentes
    const imagenesMuseoPrueba = [
      {
        name: "imagen1.jpg",
        size: "2 MB",
        url: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png",
      },
      {
        name: "imagen2.jpg",
        size: "1.5 MB",
        url: "https://e00-us-marca.uecdn.es/assets/multimedia/imagenes/2024/08/22/17242852970948.jpg",
      },
      {
        name: "imagen3.jpg",
        size: "3 MB",
        url: "https://cdn.vox-cdn.com/thumbor/CvvH4vnFRlg4RIKI0siY7VO7Gns=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/23634633/slack_imgs.jpg",
      },
    ];
    setUploadedFiles(imagenesMuseoPrueba);

    return () => {
      // Limpiar el estado de las imágenes al desmontar el componente y las url de las imagenes al desmontar
      setUploadedFiles([]);
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(file.url); // Revocar la URL del objeto para liberar memoria
      });
    };
  }, []);

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

    if (totalFiles > 8) {
      // Mensaje de error si se superan las 8 imagenes
      console.error("Máximo 8 fotos");
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

    if (totalFiles > 8) {
      toast.error(`Máximo 8 fotos`, {
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
