import React, { useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ImageSkeleton = ({ src, alt, className }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {!imgLoaded && (
        <Skeleton
          width={"100%"}
          height={"100%"}
          style={{
            borderRadius: "20px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={`${className}`}
        layoutId={alt}
        key={`${alt}-image`}
        title={alt}
        loading="lazy"
        style={{
          opacity: imgLoaded ? 1 : 0,
          transition:
            "opacity 0.3s ease-in-out, filter 0.3s ease-in-out, transform 0.3s ease-in-out",
          borderRadius: "20px",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: imgLoaded ? "static" : "absolute",
          top: 0,
          left: 0,
          pointerEvents: imgLoaded ? "auto" : "none",
        }}
        onLoad={() => setImgLoaded(true)}
      />
    </div>
  );
};

export default ImageSkeleton;
