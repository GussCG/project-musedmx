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
  onUpload,
  onDelete,
  maxFiles = 20,
  redirectTo = null,
  navigate = null,
  label = "Da click para subir las imágenes aquí o arrastra y suelta las imágenes",
  title = "Editar imágenes",
  name,
  setFieldValue,
}) {
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const hasInitialized = useRef(false);
  const lightbox = useLightBox(uploadedFiles.map((file) => file.url));

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
    if (setFieldValue && name && hasInitialized.current) {
      setTimeout(() => {
        setFieldValue(
          name,
          uploadedFiles.map((img) => {
            if (typeof img === "string") {
              return { url: img, fileObject: null };
            }
            if (img instanceof File) {
              return {
                url: URL.createObjectURL(img),
                fileObject: img,
              };
            }
            return {
              ...img,
              fileObject: img.fileObject || null,
            };
          })
        );
      }, 0);
    }
  }, [uploadedFiles, setFieldValue, name]);

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

    setProgress((prev) => [...prev, { name: file.name, percent: 0 }]);

    let percent = 0;
    const interval = setInterval(() => {
      percent += 20;
      setProgress((prev) =>
        prev.map((p) => (p.name === file.name ? { ...p, percent } : p))
      );

      if (percent >= 100) {
        clearInterval(interval);
        setProgress((prev) => prev.filter((p) => p.name !== file.name));
        setUploadedFiles((prev) => {
          const updated = [...prev, newFile];
          // Move the setFieldValue outside of this setState callback
          return updated;
        });
      }
    }, 200);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (uploadedFiles.length + files.length > maxFiles) {
      ToastMessage({ tipo: "error", mensaje: `Máximo ${maxFiles} fotos` });
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
      ToastMessage({ tipo: "error", mensaje: `Máximo ${maxFiles} fotos` });
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
            {progress.map((p) => (
              <li className="row" key={p.name}>
                <FaImage />
                <div className="content">
                  <span>{p.name} • Subiendo</span>
                  <span>{p.percent}%</span>
                  <div className="progress-bar-image">
                    <div
                      className="progress-image"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </section>
        )}

        <section className="uploaded-area">
          {uploadedFiles.map((file, index) => (
            <li className="row" key={file.id}>
              <img
                src={file.url}
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
                <button onClick={() => handleDelete(file)}>
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
