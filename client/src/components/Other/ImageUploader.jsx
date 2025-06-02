import { useState, useRef, useEffect } from "react";
import Icons from "../Other/IconProvider";
import ToastMessage from "../Other/ToastMessage";
import { formatFileName } from "../../utils/formatFileName";
import ScrollIndicator from "./ScrollIndicator";
import LightBox from "./LightBox";
import LightBoxPortal from "./LightBoxPortal";
import useLightBox from "../../hooks/Other/useLightBox";

const { FaTrash, LuImageUp, FaImage } = Icons;

export default function ImageUploader({
  initialImages = [],
  onUpload = null,
  onDelete,
  maxFiles = 20,
  redirectTo = null,
  navigate = null,
  label = "Da click para subir las imágenes aquí o arrastra y suelta las imágenes",
  title = "Editar imágenes",
  name,
  setFieldValue,
  syncWithFormik = false,
}) {
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  console.log("ImageUploader mounted with initialImages:", initialImages);

  const hasInitialized = useRef(false);
  const lightbox = useLightBox(uploadedFiles.map((file) => file.url));

  const bustCache = (url) => `${url}?v=${Date.now()}`;

  useEffect(() => {
    if (!initialImages || initialImages.length === 0 || hasInitialized.current)
      return;

    const formatted = initialImages.map((file) => ({
      id: file.id,
      name: file.name,
      size: "",
      url: file.url,
      fileObject: null,
    }));

    setUploadedFiles(formatted);
    hasInitialized.current = true;
  }, [initialImages]);

  useEffect(() => {
    if (!setFieldValue || !name) return;

    const newValue = uploadedFiles.map((img) => {
      if (img.fileObject instanceof File) {
        return { url: img.url, fileObject: img.fileObject };
      }
      return { ...img, fileObject: null };
    });

    // Solo sincronizar si syncWithFormik está activo
    if (syncWithFormik) {
      setFieldValue((prevState) => {
        const prevValue = prevState?.[name];
        const isEqual = JSON.stringify(prevValue) === JSON.stringify(newValue);
        if (!isEqual) {
          return { ...prevState, [name]: newValue };
        }
        return prevState;
      });
    } else {
      // Si no está en modo Formik, llamar como callback simple (como en MuseoImgEdit)
      setFieldValue(name, newValue);
    }
  }, [uploadedFiles, setFieldValue, name, syncWithFormik]);

  const handleFileClick = () => fileInputRef.current?.click();

  const formatBytes = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    const newFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: formatBytes(file.size),
      url: imageUrl,
      fileObject: file,
    };

    setProgress((prev) => [...prev, { name: file.name, percent: 0, file }]);

    let percent = 0;
    const interval = setInterval(() => {
      percent += 20;
      setProgress((prev) =>
        prev.map((p) => (p.name === file.name ? { ...p, percent } : p))
      );

      if (percent >= 100) {
        clearInterval(interval);
        setProgress((prev) => prev.filter((p) => p.name !== file.name));
        setUploadedFiles((prev) => [newFile, ...prev]);
      }
    }, 200);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (uploadedFiles.length + files.length > maxFiles) {
      ToastMessage({ tipo: "error", mensaje: `Máximo ${maxFiles}` });
      return;
    }
    files.forEach(simulateUpload);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (uploadedFiles.length + files.length > maxFiles) {
      ToastMessage({ tipo: "error", mensaje: `Máximo ${maxFiles}` });
      return;
    }
    files.forEach(simulateUpload);
  };

  const handleDelete = async (file) => {
    const isRemote = file.url.startsWith("http");

    if (isRemote) {
      const confirmDelete = window.confirm(
        `¿Eliminar "${file.url || "imagen"}"?`
      );
      if (!confirmDelete) return;

      if (onDelete) {
        try {
          const res = await onDelete(file.id);
          if (!res.success) {
            return ToastMessage({
              tipo: "error",
              mensaje: res.message || "Error al eliminar imagen remota",
            });
          }
        } catch (err) {
          console.error("onDelete error:", err);
          return ToastMessage({
            tipo: "error",
            mensaje: "Error al eliminar imagen remota",
          });
        }
      }
    }
    if (file.url.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));

    ToastMessage({ tipo: "success", mensaje: "Imagen eliminada" });
  };

  return (
    <>
      <LightBoxPortal>
        <LightBox
          images={uploadedFiles.map((file) => file.url)}
          isOpen={lightbox.isOpen} // Control this with a state if you want to open the lightbox
          currentIndex={lightbox.currentIndex} // Control this with a state if you want to change the index
          closeLightBox={lightbox.closeLightBox}
          goToPrev={lightbox.goToPrev}
          goToNext={lightbox.goToNext}
        />
      </LightBoxPortal>

      <div className="image-uploader">
        <div
          onClick={handleFileClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="drop-zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            hidden
          />
          <LuImageUp />
          <label>{label}</label>
        </div>

        {progress.length > 0 && (
          <section className="progress-area">
            {progress.map((p) => {
              console.log("Progress item:", p);
              return (
                <li className="row" key={p.name}>
                  <FaImage />
                  <div className="content">
                    <div className="file-info">
                      <span className="name">{p.name}</span>
                      <span className="size"> {formatBytes(p.file.size)}</span>
                    </div>
                    <div className="progress-bar-image">
                      <div
                        className="progress-image"
                        style={{
                          width: `${p.percent}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="progress-text">
                    <span className="percent">{`${p.percent} %`}</span>
                  </div>
                </li>
              );
            })}
          </section>
        )}

        <section className="uploaded-area">
          {uploadedFiles.map((file, index) => (
            <li className="row" key={file.id}>
              <img
                src={
                  file.url.startsWith("blob:") ? file.url : bustCache(file.url)
                }
                alt={file.name}
                onClick={() => lightbox.openLightBox(index)}
              />
              <div className="content">
                <div className="file-info">
                  <span className="name">
                    {formatFileName(file.url) || "Nombre"}
                  </span>
                  <span>{file.size || "Sin tamaño"}</span>
                </div>
                <button type="button" onClick={() => handleDelete(file)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </section>

        <ScrollIndicator
          style={{
            position: "absolute",
            bottom: "14%",
            left: "50%",
            transform: "translate(-50%, -14%)",
            zIndex: 100,
          }}
        />
      </div>
    </>
  );
}
