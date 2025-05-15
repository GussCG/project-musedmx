import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImage from "../../utils/cropImage";
import { Field } from "formik";

import userPlaceHolder from "../../assets/images/placeholders/user_placeholder.png";

function ImageCropper({ image, onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ratio = img.width / img.height;
        setAspectRatio(ratio);
      };
    }
  }, [image]);

  if (!image) {
    image = userPlaceHolder;
  }

  const handleCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImage(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch {
      onCropComplete(null);
    }
  };

  const handleCancel = () => {
    onCropComplete(null);
  };

  return (
    <>
      <div className="bg-opaco-blur"></div>
      <div className="image-cropper-container">
        <h1>Recortar Imagen</h1>
        <div className="image-cropper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            objectFit="auto"
          />
        </div>
        <div className="image-cropper-controls">
          <div className="image-cropper-controls-zoom">
            <label className="zoom-label">
              <b>Zoom</b>: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="zoom-slider"
            />
          </div>
          <div className="image-cropper-controls-buttons">
            <Field
              type="button"
              onClick={handleSave}
              className="button"
              value="Recortar y Guardar"
            />
            <Field
              onClick={handleCancel}
              className="button"
              type="button"
              value="Cancelar"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageCropper;
